from django.shortcuts import render
from django.shortcuts import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import TosDocument

# POST
@csrf_exempt
def summarize_tos(request):
    text = request.POST.get('text')
    
    if not text:
        return JsonResponse({"error": "No ToS text provided"}, status=400)
    

    # insert summarization logic here

    # insert sorting logic here

    bullets = {
        "good": [],
        "neutral": [],
        "bad": []
    }

    tos_doc = TosDocument.objects.create(text=text, bullets = bullets)
    return JsonResponse({
        'id': tos_doc.id
    })

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






