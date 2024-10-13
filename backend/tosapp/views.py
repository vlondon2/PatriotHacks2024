from openai import OpenAI
import os
import re

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
from django.conf import settings
from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import TosDocument

# Define a helper function to load file contents
def load_file_contents(filename):
    try:
        with open(filename, 'r') as file:
            return file.read()
    except FileNotFoundError:
        return None

# POST
@csrf_exempt
def summarize_tos(request):
    text = request.POST.get('text')

    file_map = {
        "ddgo": os.path.join(settings.BASE_DIR, "tosapp/testfiles/ddgo.txt"),
        "paypal": os.path.join(settings.BASE_DIR, "tosapp/testfiles/paypal.txt"),
        "startpage": os.path.join(settings.BASE_DIR, "tosapp/testfiles/startpage.txt")
    }

    if not text:
        return JsonResponse({"error": "No text identifier provided"}, status=400)

    # Check if the provided text matches one of the expected keys
    if text in file_map:
        file_path = file_map[text]
        file_contents = load_file_contents(file_path)

        if not file_contents:
            return JsonResponse({"error": f"File not found for {text}"}, status=404)
    else:
        return JsonResponse({"error": "Invalid text identifier"}, status=400)

    try:
        # Call OpenAI API to summarize and extract key points from the file contents
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Update model if necessary
            messages=[
                {"role": "user", "content": f"Summarize the following content and highlight key points related to privacy, liability, and user rights. Also categorize them into 'good', 'neutral', or 'bad' for the user. Use specific formatting, starting each section with 'good:', 'bad:', or 'neutral:' as raw text without quotes and putting each point on a separate line as a sentence:\n\n{file_contents}"},
            ],
            max_tokens=1024,  # Adjust based on the expected length of the summary
            temperature=0.7
        )

        # Extract response text
        summary_text = response.choices[0].message.content.strip()

        # Process the API response and categorize into good, neutral, bad
        bullets = {
            "good": [],
            "neutral": [],
            "bad": []
        }

        lines = summary_text.split("\n")
        current_section = None

        for line in lines:
            # Remove leading punctuation (like dashes, bullet points, etc.)
            line = re.sub(r'^[\s*–•-]+', '', line).strip()  # Remove leading dashes or bullet points

            if line.lower().startswith("good:"):
                current_section = "good"
            elif line.lower().startswith("neutral:"):
                current_section = "neutral"
            elif line.lower().startswith("bad:"):
                current_section = "bad"
            elif current_section:
                bullets[current_section].append(line)

        # Save the document and bullets to the database
        tos_doc = TosDocument.objects.create(text=file_contents, bullets=bullets)

        print(f"good: {bullets['good']}")
        print(f"neutral: {bullets['neutral']}")
        print(f"bad: {bullets['bad']}")

        return JsonResponse({
            'id': tos_doc.id,
            'good': tos_doc.bullets['good'],
            'neutral': tos_doc.bullets['neutral'],
            'bad': tos_doc.bullets['bad']
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# GET
def get_bullets(request):
    try:
        doc_id = request.GET.get('doc_id')
        tos_doc = TosDocument.objects.get(id=doc_id)
    except TosDocument.DoesNotExist:
        return JsonResponse({'error': 'ToS doc not found'}, status=404)

    return JsonResponse({
        'id': tos_doc.id,
        'good': tos_doc.bullets["good"],
        'neutral': tos_doc.bullets["neutral"],
        'bad': tos_doc.bullets["bad"]
    })