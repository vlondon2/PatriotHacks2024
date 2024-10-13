from openai import OpenAI

client = OpenAI(api_key="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")
from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import TosDocument

# Set up OpenAI API key (ensure you set this up in your environment variables or Django settings)

# POST
@csrf_exempt
def summarize_tos(request):
    text = request.POST.get('text')

    if not text:
        return JsonResponse({"error": "No ToS text provided"}, status=400)

    try:
        # Call OpenAI API to summarize and extract key points from ToS
        response = client.chat.completions.create(model="gpt-4o-mini",  # Updated model name if needed
        messages=[
            {"role": "user", "content": f"Summarize the following Terms of Service and highlight key points related to privacy, liability, and user rights. Also categorize them into 'good', 'neutral', or 'bad' for the user. Use very specific formatting, starting each section with 'good:', 'bad:', or 'neutral:' and putting each point on a separate line:\n\n{text}"},
        ],
        max_tokens=1024,  # Adjust based on the expected length of the summary
        temperature=0.7)

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
            if line.lower().startswith("good:"):
                current_section = "good"
            elif line.lower().startswith("neutral:"):
                current_section = "neutral"
            elif line.lower().startswith("bad:"):
                current_section = "bad"
            elif current_section:
                bullets[current_section].append(line.strip())

        # Save ToS document and bullets to the database
        tos_doc = TosDocument.objects.create(text=text, bullets=bullets)

        print(f"good:{bullets['good']}")
        print(f"neutral:{bullets['neutral']}")
        print(f"bad:{bullets['bad']}")

        return JsonResponse({
            'id': tos_doc.id,
            'good': bullets['good'],
            'neutral': bullets['neutral'],
            'bad': bullets['bad']
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
        'text': tos_doc.text,
        'good': tos_doc.bullets["good"],
        'neutral': tos_doc.bullets["neutral"],
        'bad': tos_doc.bullets["bad"]
    })