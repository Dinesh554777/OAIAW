from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas, auth
from database import get_db

router = APIRouter(prefix="/assessments", tags=["assessments"])

@router.post("", response_model=schemas.AssessmentResponse, status_code=status.HTTP_201_CREATED)
def create_assessment(
    assessment: schemas.AssessmentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_role([models.Role.ASSESSOR, models.Role.ADMIN]))
):
    new_assessment = models.Assessment(
        title=assessment.title,
        description=assessment.description,
        duration_minutes=assessment.duration_minutes,
        difficulty=assessment.difficulty,
        status=assessment.status,
        created_by=current_user.id
    )
    db.add(new_assessment)
    db.commit()
    db.refresh(new_assessment)
    return new_assessment

@router.get("", response_model=List[schemas.AssessmentResponse])
def get_assessments(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    if current_user.role in [models.Role.ASSESSOR, models.Role.ADMIN]:
        assessments = db.query(models.Assessment).all()
    else:
        assessments = db.query(models.Assessment).filter(models.Assessment.status == models.AssessmentStatus.PUBLISHED).all()
    return assessments

@router.get("/{assessment_id}", response_model=schemas.AssessmentResponse)
def get_assessment(
    assessment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    if current_user.role == models.Role.CANDIDATE and assessment.status != models.AssessmentStatus.PUBLISHED:
        raise HTTPException(status_code=403, detail="Not authorized to view this assessment")
        
    return assessment

@router.put("/{assessment_id}", response_model=schemas.AssessmentResponse)
def update_assessment(
    assessment_id: int,
    assessment_update: schemas.AssessmentUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_role([models.Role.ASSESSOR, models.Role.ADMIN]))
):
    assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    update_data = assessment_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(assessment, key, value)
        
    db.commit()
    db.refresh(assessment)
    return assessment

@router.delete("/{assessment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_assessment(
    assessment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_role([models.Role.ASSESSOR, models.Role.ADMIN]))
):
    assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    db.delete(assessment)
    db.commit()
    return None

@router.post("/{assessment_id}/tasks", response_model=schemas.TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    assessment_id: int,
    task: schemas.TaskCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_role([models.Role.ASSESSOR, models.Role.ADMIN]))
):
    assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
        
    new_task = models.Task(
        assessment_id=assessment_id,
        title=task.title,
        description=task.description,
        repository_url=task.repository_url,
        starter_repository=task.starter_repository,
        task_type=task.task_type,
        constraints=task.constraints
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.get("/{assessment_id}/tasks", response_model=List[schemas.TaskResponse])
def get_tasks(
    assessment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
        
    if current_user.role == models.Role.CANDIDATE and assessment.status != models.AssessmentStatus.PUBLISHED:
        raise HTTPException(status_code=403, detail="Not authorized to view tasks for this assessment")
        
    return assessment.tasks
