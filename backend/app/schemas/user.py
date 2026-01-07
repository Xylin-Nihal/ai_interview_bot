from pydantic import BaseModel, EmailStr

# -------- Signup --------
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None


# -------- Login --------
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# -------- Response --------
class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str | None = None

    class Config:
        from_attributes = True
