import re
from sqlalchemy.orm import Session
from models import AIClaim, ClaimStatus, ClaimEvidence

class ClaimVerifier:
    def __init__(self, db: Session, assessment_session_id: int):
        self.db = db
        self.assessment_session_id = assessment_session_id

    def extract_and_record_claims(self, message: str) -> list[AIClaim]:
        """
        Lightweight claim extraction from LLM responses.
        We look for strong assertions like "tests pass", "bug is fixed", etc.
        """
        claims = []
        message_lower = message.lower()
        
        # Simple heuristic extraction
        patterns = [
            (r"(all\s+tests\s+pass(?:ed)?)", "All tests pass"),
            (r"(bug\s+is\s+fixed)", "Bug is fixed"),
            (r"(authentication\s+is\s+fixed)", "Authentication is fixed"),
            (r"(deployment\s+succeeded)", "Deployment succeeded")
        ]
        
        for pattern, normalized_claim in patterns:
            if re.search(pattern, message_lower):
                claim = AIClaim(
                    assessment_session_id=self.assessment_session_id,
                    claim=normalized_claim,
                    status=ClaimStatus.UNVERIFIED
                )
                self.db.add(claim)
                claims.append(claim)
                
        self.db.commit()
        return claims

    def verify_claims_against_tools(self, claims: list[AIClaim], tool_calls: list[dict]):
        """
        Evaluate UNVERIFIED claims against actual tool execution results.
        If a claim is about tests, we check the actual test output.
        """
        for claim in claims:
            if claim.status != ClaimStatus.UNVERIFIED:
                continue
                
            if "tests pass" in claim.claim.lower():
                # Look for a run_tests tool call
                test_call = next((tc for tc in tool_calls if tc.get("tool_name") == "run_tests"), None)
                if test_call:
                    result = test_call.get("result", {})
                    if isinstance(result, str):
                        import json
                        try:
                            result = json.loads(result)
                        except:
                            pass
                            
                    status = result.get("status", "")
                    if status == "success":
                        claim.status = ClaimStatus.VERIFIED
                        evidence = ClaimEvidence(claim=claim, evidence_text="Test tool returned success.")
                        self.db.add(evidence)
                    elif status == "failed":
                        claim.status = ClaimStatus.CONTRADICTED
                        evidence = ClaimEvidence(claim=claim, evidence_text="Test tool returned failure.")
                        self.db.add(evidence)
                        
        self.db.commit()
