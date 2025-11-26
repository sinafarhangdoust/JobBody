from typing import Optional, Literal

from pydantic import BaseModel, Field

class JobSearchParamsInput(BaseModel):
    keywords: Optional[str] = Field(..., description="Job title or keywords, e.g., 'Python Developer'")
    location: Optional[str] = Field(..., description="Location to search, e.g., 'Denmark'")
    start: int = Field(0, description="The start of the search, useful for pagination.")
    limit: Optional[int] = Field(10, ge=1, le=50, description="Number of jobs to retrieve")
    time_filter: Optional[int] = Field(None, description="Time filter in seconds")
    sort_by: Literal['R', 'DD'] = Field('R', description="Sort by Relevance (R) or Recency (DD)")

class UserInstructionsInput(BaseModel):
    instructions: str = Field(..., description="The user instructions about the relevancy of the jobs")

class ResumeInput(BaseModel):
    resume: str = Field(..., description="User's resume")