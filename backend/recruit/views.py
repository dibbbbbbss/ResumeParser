from django.views.decorators.csrf import csrf_exempt
import os
import tempfile
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes,parser_classes
# from rest_framework.permissions import AllowAny
from .resume import extract_text_from_pdf, rnlp
from .job_desc import extract_jdtext_from_pdf, jdnlp
from .serializers import ResumeSerializer
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import UploadedFile
from .models import Resume  # Import the Parse model
from .models import JobDesc  # Import the Parse model
import ast
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.parsers import MultiPartParser

# post request for resume parser


@csrf_exempt
@permission_classes([IsAuthenticated])  # Ensure only authenticated users can access
@api_view(['POST'])
@parser_classes([MultiPartParser])
def parse_resume(request):
    if request.method == 'POST':
        resume_file = request.FILES.get('resume')
        job_desc_id = request.POST.get('job_id')

        if not resume_file or not job_desc_id:
            print('Resume or job ID missing')
            return JsonResponse({'error': 'Resume file or job ID missing'}, status=status.HTTP_400_BAD_REQUEST)

        if not isinstance(resume_file, UploadedFile):
            print('Invalid file format')
            return JsonResponse({'error': 'Invalid file format'}, status=status.HTTP_400_BAD_REQUEST)

        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            for chunk in resume_file.chunks():
                temp_file.write(chunk)
            temp_file_path = temp_file.name

        try:
            resume_text = extract_text_from_pdf(temp_file_path)
            doc = rnlp(resume_text)
            entities = [[ent.label_, ent.text] for ent in doc.ents]
        except Exception as e:
            os.unlink(temp_file_path)
            print(f'Error parsing resume: {str(e)}')
            return JsonResponse({'error': f'Error parsing resume: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        os.unlink(temp_file_path)

        if entities:
            resume_data = {
                'name': '',
                'email': '',
                'location': '',
                'college_name': '',
                'degree': '',
                'companies': '',
                'worked_as': '',
                'skills': [],
                'experience': '',
                'linkedin': '',
                'extracted_data': entities,
                'jobdesc':job_desc_id
            }

            for entity in entities:
                entity_label = entity[0].lower()
                entity_text = entity[1].strip()

                if entity_label == 'name':
                    resume_data['name'] = entity_text
                elif entity_label == 'email address':
                    resume_data['email'] = entity_text
                elif entity_label == 'location':
                    resume_data['location'] = entity_text
                elif entity_label == 'college name':
                    resume_data['college_name'] = entity_text
                elif entity_label == 'degree':
                    resume_data['degree'] = entity_text
                elif entity_label == 'companies worked at':
                    resume_data['companies'] = entity_text
                elif entity_label == 'worked as':
                    resume_data['worked_as'] = entity_text
                elif entity_label == 'skills':
                    resume_data['skills'].append(entity_text)
                elif entity_label == 'years of experience':
                    resume_data['experience'] = entity_text
                elif entity_label == 'linkedin link':
                    resume_data['linkedin'] = entity_text

            resume_data['skills'] = ', '.join(resume_data['skills'])
            resume_data['extracted_data'] = str(resume_data['extracted_data'])

            resume_serializer = ResumeSerializer(data=resume_data)

            if resume_serializer.is_valid():
                parse_instance = resume_serializer.save()

                try:
                    job_desc = JobDesc.objects.get(id=job_desc_id)
                    parse_instance.jobdesc = job_desc
                    parse_instance.save()
                except JobDesc.DoesNotExist:
                    return JsonResponse({'error': 'Job description not found'}, status=status.HTTP_404_NOT_FOUND)

                return JsonResponse({'success': 'Resume data extracted and saved successfully', 'id': parse_instance.id}, status=status.HTTP_200_OK)
            else:
                print('Serializer errors:', resume_serializer.errors)
                return JsonResponse(resume_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return JsonResponse({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
# get request for resume parser   
    

@csrf_exempt
@api_view(['GET'])   
def get_parsed_data(request):
    if request.method == 'GET':
        # Retrieve all stored parsed data
        parsed_data = Resume.objects.all()
        data_list = [{'id': item.id, 'name': item.name, 'jobdesc': item.jobdesc,'email':item.email, 'location':item.location, 'college_name':item.college_name, 'degree':item.degree, 'companies':item.companies, 'worked_as':item.worked_as, 'skills':item.skills,  'experience':item.experience, 'linkedin':item.linkedin,  'extracted_data': item.extracted_data,} for item in parsed_data]

        print(data_list)
        return JsonResponse({'parsed_data': data_list})
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    
    
    # Post request for jd parser
    
@csrf_exempt
@permission_classes([IsAuthenticated])  # Ensure only authenticated users can access
@api_view(['POST','GET'])
def parse_jd(request):
    if request.method == 'POST':
        user = request.user
        jd_file = request.FILES.get('jd')
        if not jd_file:
            return JsonResponse({'error': 'No file provided'}, status=400)

        # Validate uploaded file format (PDF, DOC, DOCX)
        allowed_formats = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        if jd_file.content_type not in allowed_formats:
            return JsonResponse({'error': 'Invalid file format. Only PDF, DOC, or DOCX allowed.'}, status=400)
        
        # Save the uploaded file to a temporary location
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            for chunk in jd_file.chunks():
                temp_file.write(chunk)
            temp_file_path = temp_file.name
        
        try:
            jd_text = extract_jdtext_from_pdf(temp_file_path)
            doc = jdnlp(jd_text)
            entities = [[ent.label_,ent.text] for ent in doc.ents]
        except Exception as e:
            # Handle parsing errors
            os.unlink(temp_file_path)  # Delete the temporary file
            return JsonResponse({'error': f'Error parsing resume: {str(e)}'}, status=500)

        os.unlink(temp_file_path)  # Delete the temporary file
        if entities:
    # Save extracted data to Parse model instance
    
            jobpost = ""
            degree = ""
            skills = []
            experience = ""
            
            for entity in entities:
                  if entity[0].lower() == 'jobpost':
                      jobpost = entity[1]
                  elif entity[0].lower() == 'degree':
                      degree = entity[1]
                  elif entity[0].lower() == 'skills':
                      skills += entity[1].split(',')
                  elif entity[0].lower() == 'experience':
                      experience = entity[1]                
                        
            print("Job Title:", jobpost)
            print("Degree:", degree)
            print("Skills:", skills)
            print("Years of experience:", experience)    
            
            try:
                jd_ents_instance = JobDesc.objects.create(
                    user=user,
                    jobpost=jobpost,  # Ensure jobpost has a value here
                    degree=degree,
                    skills=skills,
                    experience=experience,
                    extracted_data=entities
                )
                return JsonResponse({'success': 'Job data extracted and saved successfully', 'id': jd_ents_instance.id})
            except Exception as e:
                return JsonResponse({'error': f'Error saving JD data: {str(e)}'}, status=500)


        # jd_ents_instance = JobDesc.objects.create(user=request.user,jobpost=jobpost, degree=degree, skills=skills, experience=experience, extracted_data=entities)
            
        # return JsonResponse({'success': 'Job data extracted and saved successfully', 'id': jd_ents_instance.id})
        
            
        else:
            return JsonResponse({'error': 'No entities found'}, status=400)
        
    return JsonResponse({'error': 'Invalid method'}, status=405)


@csrf_exempt
@permission_classes([IsAuthenticated])

@api_view(['GET'])
def get_parsedjd_data(request):
    if request.method == 'GET':
        # Retrieve the latest stored parsed JD data
        try:
            latest_jd_ents = JobDesc.objects.filter(user=request.user).order_by('-created_at')
            parsejd_data = []
            
            for entry in latest_jd_ents:
                
            
                data = {
                'id': entry.id,
                'user': request.user.id,
                'jobpost': entry.jobpost,
                'degree': entry.degree,
                'skills': entry.skills,
                'experience': entry.experience,
                'extracted_data': entry.extracted_data,
                }
                parsejd_data.append(data)
            return JsonResponse({'parsedjd_data': parsejd_data})
        except JobDesc.DoesNotExist:
            return JsonResponse({'error': 'No parsed JD data available'}, status=404)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    

@csrf_exempt
@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_job_data(request):
    if request.method == 'GET':
        # Retrieve the latest stored parsed JD data
        try:
            latest_jd_ents = JobDesc.objects.all().order_by('-created_at')
            parsejd_data = []
            
            for entry in latest_jd_ents:
                
            
                data = {
                'id': entry.id,
                'jobpost': entry.jobpost,
                'degree': entry.degree,
                'skills': entry.skills,
                'experience': entry.experience,
                'extracted_data': entry.extracted_data,
                }
                parsejd_data.append(data)
            return JsonResponse({'parsedjd_data': parsejd_data})
        except JobDesc.DoesNotExist:
            return JsonResponse({'error': 'No parsed JD data available'}, status=404)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    


@csrf_exempt
@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_job_detail(request,job_id):
    if request.method == 'GET':
        
        try:
            job = JobDesc.objects.get(id=job_id)
            data = {
                'id': job.id,
                'jobpost': job.jobpost,
                'degree': job.degree,
                'skills': job.skills,
                'experience': job.experience,
                'extracted_data': job.extracted_data,
            }
            print(job)
            return JsonResponse({'job_detail':data})
        except JobDesc.DoesNotExist:
            return JsonResponse({'error':'Job Detail not found'},status=404)
        
    else:
        return JsonResponse({'error':'Method not allowed'},status=405)


@csrf_exempt
@permission_classes([IsAuthenticated])
@api_view(['GET']) 
def get_ranked_resume(request,job_desc_id):
 if request.method == 'GET':
    try:
        job_description = JobDesc.objects.get(user=request.user,id=job_desc_id)
        print(job_description)  # Print the job_description object to verify its content

    except JobDesc.DoesNotExist:
        return JsonResponse({'error':'Job description not found or not authorized'},status=404)
    
        
        
    
    # Fetch the resume associated with that job desc
        
    resume_data = Resume.objects.filter(jobdesc=job_description)
    print("Resume:",resume_data)
    resume_entities = [{'resume_id': item.id, 'name': item.name, 'email':item.email, 'location':item.location, 'college_name':item.college_name, 'resume_degree':item.degree, 'resume_companies':item.companies, 'resume_worked_as':item.worked_as, 'resume_skills':item.skills,  'resume_experience':item.experience, 'linkedin':item.linkedin, 'extracted_data':item.extracted_data } for item in resume_data]

    job_description_entities = {
            'jd_id': job_description.id,
            'required_degree': job_description.degree,
            'jobpost': job_description.jobpost,
            'required_skills': job_description.skills,
            'required_experience': job_description.experience,
            'extracted_data': job_description.extracted_data,
        }
    print("Job desc enetites",job_description_entities)
    # print(resume_data)


    def normalize_years_of_experience(experience):
        return float(experience.split()[0]) if experience else 0
    def normalize_skills(resume_skills, required_skills):
        resume_skills_list = [skill.strip().lower() for skill in resume_skills.split(',')]
        required_skills_list = [skill.strip().lower() for skill in required_skills.split(',')]

        matching_skills = sum(1 for skill in resume_skills_list if skill in required_skills_list)
        return matching_skills

    def normalize_degree(resume_degree, required_degree):
        return 1 if resume_degree.lower() in required_degree.lower() else 0

    def normalize_worked_as(resume_worked_as, jobpost):   
        return 1 if resume_worked_as.lower() in jobpost.lower() else 0
      
    def calculate_score(resume, job_description, weights):
        # Normalize data
        normalized_experience = normalize_years_of_experience(resume['resume_experience'])
        
        normalized_skills = normalize_skills(resume['resume_skills'], job_description['required_skills'])
        print("Normalized Skills:", normalized_skills)

        normalized_degree = normalize_degree(resume['resume_degree'], job_description['required_degree'])

        normalized_worked_as = normalize_worked_as(resume['resume_worked_as'], job_description['jobpost'])

        # Calculate difference in experience
        required_experience = normalize_years_of_experience(job_description['required_experience'])
        experience_difference = normalized_experience - required_experience
        print("Experience Difference:", experience_difference)

        # Calculate scores
        score = (weights['experience'] * experience_difference) + (weights['skills'] * normalized_skills) + (weights['degree'] * normalized_degree) + (weights['worked_as'] * normalized_worked_as)
        print("Score:", score)
        return score

    def rank_resumes(resumes, job_description, weights):
        ranked_resumes = []
        print(resumes)
        for resume in resumes:
        #  for job_description in job_descriptions:
            print("Job desc: ",job_description)
            score = calculate_score(resume,job_description, weights)       
            print('Score: ',score)
    
            
            ranked_resumes.append({'id': resume['resume_id'], 'name': resume['name'], 'email': resume['email'], 'score': score, 'jobpost': job_description['jobpost'],})
        ranked_resumes.sort(key=lambda x: x['score'], reverse=True)
        print("ranked resumes: ",ranked_resumes)
        return ranked_resumes[:10]

    # Assigning wts.
    weights = {'experience': 0.3, 'skills': 0.4, 'degree': 0.05, 'worked_as': 0.25}

    # Rank resumes
    ranked_resumes = rank_resumes(resume_entities, job_description_entities, weights)
    print(type(ranked_resumes))
    print('ranked resumes: ',ranked_resumes)

    # Print ranked resumes
    for i, resume in enumerate(ranked_resumes, 1):

        print(f"Rank {i}: Resume ID: {resume['id']}, Name:{resume['name']}, Email:{resume['email']}, Jobpost:{resume['jobpost']}, Score: {resume['score']}")
        
        
        
    return JsonResponse({'ranked_resumes': ranked_resumes}) 
 else:
    return JsonResponse({'error': 'Method not allowed'}, status=405)
