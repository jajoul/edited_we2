import requests
from decouple import config


class LiveService:
    
    def create_room(self, live_object):
        # URL of the Node.js service endpoint
        node_url = f'{config("NODE_URL", cast=str, default="http://nodejs:3000/")}room/create/'

        # Data to be sent in the POST request body
        data = {
            'room_id': live_object.room_id
        }

        try:
            # Sending the POST request to the Node.js service
            response = requests.post(node_url, json=data)

            # Check the response status and content
            if response.status_code == 200:
                print('POST request sent successfully to Node.js service')
                parsed_data = response.json()
                print('Response:', response.json())
                live_object.rtp_cap = parsed_data['rtp_cap']
                live_object.save()
                parsed_data.update({'room_id': live_object.room_id})
                print("Final response: ", parsed_data)
                return parsed_data
            else:
                print('Failed to send POST request to Node.js service')
                print('Response status:', response.status_code)
        except requests.RequestException as e:
            print('Error sending POST request:', e)
    
    def create_producer(self, live_object):
        # URL of the Node.js service endpoint
        node_url = f'{config("NODE_URL", cast=str, default="http://nodejs:3000/")}producer/create/'

        # Data to be sent in the POST request body
        data = {
            'room_id': live_object.room_id
        }

        try:
            # Sending the POST request to the Node.js service
            response = requests.post(node_url, json=data)
            print('Node server is: ', node_url, data)
            print(response.text)

            # Check the response status and content
            if response.status_code == 200:
                print('POST request sent successfully to Node.js service')
                parsed_data = response.json()
                print('Response:', response.json())
                live_object.producer_id = parsed_data['id']
                live_object.save()
                return parsed_data
            else:
                print('Failed to send POST request to Node.js service')
                print('Response status:', response.status_code)
        except requests.RequestException as e:
            print('Error sending POST request:', e)

    def create_consumer(self, live_object):
        # URL of the Node.js service endpoint
        node_url = f'{config("NODE_URL", cast=str, default="http://nodejs:3000/")}consumer/create/'

        # Data to be sent in the POST request body
        data = {
            'room_id': live_object.room_id
        }

        try:
            # Sending the POST request to the Node.js service
            response = requests.post(node_url, json=data)

            # Check the response status and content
            if response.status_code == 200:
                print('POST request sent successfully to Node.js service')
                parsed_data = response.json()
                print('Response:', response.json())
                return parsed_data
            else:
                print('Failed to send POST request to Node.js service')
                print('Response status:', response.status_code)
        except requests.RequestException as e:
            print('Error sending POST request:', e)

    def connect_consumer(self, live_object, consumer_id):
        # URL of the Node.js service endpoint
        node_url = f'{config("NODE_URL", cast=str, default="http://nodejs:3000/")}consumer/connect/'

        # Data to be sent in the POST request body
        data = {
            'room_id': live_object.room_id,
            'producer_id': live_object.producer_id,
            'consumer_id': consumer_id,
            'rtp_cap': live_object.rtp_cap,
        }

        try:
            # Sending the POST request to the Node.js service
            response = requests.post(node_url, json=data)

            # Check the response status and content
            if response.status_code == 200:
                print('POST request sent successfully to Node.js service')
                parsed_data = response.json()
                print('Response:', response.json())
                return parsed_data
            else:
                print('Failed to send POST request to Node.js service')
                print('Response status:', response.status_code)
        except requests.RequestException as e:
            print('Error sending POST request:', e)

    def connect_producer(self, live_object, dlts_parameter):
        # URL of the Node.js service endpoint
        node_url = f'{config("NODE_URL", cast=str, default="http://nodejs:3000/")}producer/connect/'

        # Data to be sent in the POST request body
        data = {
            'transport_id': live_object.transport_id,
            'dtls_parameter': dlts_parameter,
        }

        try:
            # Sending the POST request to the Node.js service
            response = requests.post(node_url, json=data)

            # Check the response status and content
            if response.status_code == 200:
                print('POST request sent successfully to Node.js service')
                parsed_data = response.json()
                print('Response:', response.json())
                return parsed_data
            else:
                print('Failed to send POST request to Node.js service')
                print('Response status:', response.status_code)
        except requests.RequestException as e:
            print('Error sending POST request:', e)

    def connect_producer(self, live_object, rtp_parameters, kind):
        # URL of the Node.js service endpoint
        node_url = f'{config("NODE_URL", cast=str, default="http://nodejs:3000/")}producer/produce/'

        # Data to be sent in the POST request body
        data = {
            'transport_id': live_object.transport_id,
            'rtp_parameters': rtp_parameters,
            'kind': kind
        }

        try:
            # Sending the POST request to the Node.js service
            response = requests.post(node_url, json=data)

            # Check the response status and content
            if response.status_code == 200:
                print('POST request sent successfully to Node.js service')
                parsed_data = response.json()
                print('Response:', response.json())
                return parsed_data
            else:
                print('Failed to send POST request to Node.js service')
                print('Response status:', response.status_code)
        except requests.RequestException as e:
            print('Error sending POST request:', e)

    def resume_consumer(self, consumer_id):
        # URL of the Node.js service endpoint
        node_url = f'{config("NODE_URL", cast=str, default="http://nodejs:3000/")}consumer/consume/'

        # Data to be sent in the POST request body
        data = {
            'consumer_id': consumer_id
        }

        try:
            # Sending the POST request to the Node.js service
            response = requests.post(node_url, json=data)

            # Check the response status and content
            if response.status_code == 200:
                print('POST request sent successfully to Node.js service')
                parsed_data = response.json()
                print('Response:', response.json())
                return parsed_data
            else:
                print('Failed to send POST request to Node.js service')
                print('Response status:', response.status_code)
        except requests.RequestException as e:
            print('Error sending POST request:', e)
