import time
from datetime import datetime
import models
from sqlalchemy.orm import Session

def run_evaluation(db: Session, run_id: int):
    # Retrieve the run and session
    run = db.query(models.EvaluationRun).filter(models.EvaluationRun.id == run_id).first()
    if not run:
        return
        
    session = run.session
    task_id = session.task_id
    
    # Update status
    run.status = models.EvalStatus.RUNNING
    db.commit()
    
    # Get all test cases for this task (hidden and visible)
    test_cases = db.query(models.TestCase).filter(models.TestCase.task_id == task_id).all()
    
    # If no test cases exist, we create dummy ones for the prototype
    if not test_cases:
        tc1 = models.TestCase(task_id=task_id, name="Basic Functionality", category=models.TestCategory.FUNCTIONAL, is_hidden=0)
        tc2 = models.TestCase(task_id=task_id, name="Handles Null Input", category=models.TestCategory.EDGE_CASE, is_hidden=1)
        tc3 = models.TestCase(task_id=task_id, name="Security - Path Traversal", category=models.TestCategory.CODE_QUALITY, is_hidden=1)
        db.add_all([tc1, tc2, tc3])
        db.commit()
        test_cases = [tc1, tc2, tc3]
    
    # Mock test execution
    import random
    for tc in test_cases:
        # Simulate execution time
        exec_time = random.uniform(0.1, 1.5)
        
        # Deterministic mock result based on category for prototype
        if tc.category == models.TestCategory.FUNCTIONAL:
            status = models.TestStatus.PASS
            output = "Expected 3, got 3."
            failure = None
        elif tc.category == models.TestCategory.EDGE_CASE:
            # We'll fail edge cases randomly or deterministically
            status = models.TestStatus.FAIL
            output = "Expected null to throw error, got silent return."
            failure = "AssertionError: silent return"
        else:
            status = models.TestStatus.PASS
            output = "Code style and static analysis passed."
            failure = None
            
        result = models.TestResult(
            evaluation_run_id=run.id,
            test_case_id=tc.id,
            status=status,
            execution_time=exec_time,
            output_summary=output,
            failure_summary=failure
        )
        db.add(result)
        
    # Mark run complete
    run.status = models.EvalStatus.COMPLETED
    run.completed_at = datetime.now()
    db.commit()
