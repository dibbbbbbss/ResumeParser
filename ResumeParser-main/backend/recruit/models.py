from django.db import models
from useraccount.models import User
# Create your models here.

# class Skills(models.Model):
#     name = models.CharField(max_length=255)
    
    
#     def __str__(self):
#         return self.name
    
    
# class Degree(models.Model):
#     degree = models.CharField(max_length=255)
    
    
#     def __str__(self):
#         return self.degree
    

    
# class University(models.Model):
#     university = models.CharField(max_length=255)
    
    
#     def __str__(self):
#         return self.university
    

# class Awards(models.Model):
#     award_name = models.CharField(max_length=255)
    
#     def __str__(self):
#         return self.award_name
    
    
# class Language(models.Model):
#     language = models.CharField(max_length=255)
    
    
#     def __str__(self):
#         return self.language


# class Certification(models.Model):
#     certification = models.CharField(max_length=255)
    
    
#     def __str__(self):
#         return self.certification


# class PreviousCompanies(models.Model):
#     company = models.CharField(max_length=255)
    
    
#     def __str__(self):
#         return self.company
    

# class PreviousRole(models.Model):
#     role = models.CharField(max_length=255)
    
    
    
#     def __str__(self):
#         return self.role
       
# class Resume(models.Model):
#     linked_link = models.CharField(max_length=255)
#     name = models.CharField(max_length=255)
#     location = models.CharField(max_length=255)
#     experience = models.CharField(max_length=255)
#     college_name = models.CharField(max_length=255)
#     graduation_year = models.CharField(max_length=255)
#     skill = models.ForeignKey(Skills,on_delete=models.PROTECT)
#     degree = models.ForeignKey(Degree,on_delete=models.PROTECT)
#     university = models.ForeignKey(University,on_delete=models.PROTECT)
#     award = models.ForeignKey(Awards,on_delete=models.PROTECT)
#     email_address = models.EmailField()
#     language = models.CharField(max_length=255)
#     certification = models.ForeignKey(Certification,on_delete=models.PROTECT)
#     previous_companies = models.ForeignKey(PreviousCompanies,on_delete=models.PROTECT)
#     worked_as = models.ForeignKey(PreviousRole,on_delete=models.PROTECT)
#     created_at = models.DateTimeField(auto_now_add=True)
#     extracted_data = models.TextField(blank=True)
    
    
#     def __str__(self):
#         return self.name
    
    
    
        

    
class JobDesc(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    jobpost = models.CharField(max_length=255)
    degree = models.CharField(max_length= 255)
    skills = models.CharField(max_length= 500)
    experience = models.CharField(max_length= 255)
    extracted_data = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.jobpost

    
# Create your models here.
class Resume(models.Model):
    name = models.CharField(max_length= 255)
    jobdesc = models.ForeignKey(JobDesc,on_delete=models.CASCADE)
    email = models.EmailField(default='Unknown')
    location = models.CharField(max_length= 255)
    college_name = models.CharField(max_length=255)
    degree = models.CharField(max_length= 255)
    companies = models.CharField(max_length= 255)
    worked_as = models.CharField(max_length= 255)
    skills = models.CharField(max_length= 500)
    experience = models.CharField(max_length= 255)
    linkedin = models.URLField(blank=True, null=True)
    extracted_data = models.TextField(blank = True)

    def __str__(self):
        return self.email

