from django.test import TestCase
from django.urls import reverse

class ToSTestCase(TestCase):
    def test_summarize_tos_post(self):
        # Updated input text for the test
        text = """
        By using our service, you agree to the following terms. We respect your privacy and will not share your data with third parties without your consent. 
        You are responsible for maintaining the confidentiality of your account information. 
        Please contact us if you have any questions or concerns.
        """
        response = self.client.post(reverse('summarize_tos'), data={'text': text})
        self.assertEqual(response.status_code, 200)  # Check for successful response
        self.assertIn('id', response.json())  # Ensure the response has an ID

    def test_get_bullets(self):
        # First, create a ToS document
        post_response = self.client.post(reverse('summarize_tos'), data={'text': 'Your Terms of Service text here.'})
        doc_id = post_response.json().get('id')

        # Now test the GET request
        get_response = self.client.get(reverse('get_bullets'), {'doc_id': doc_id})
        self.assertEqual(get_response.status_code, 200)  # Check for successful response
        self.assertIn('good', get_response.json())  # Ensure the response contains bullets
