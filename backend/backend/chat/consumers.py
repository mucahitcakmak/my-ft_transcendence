import json
from idlelib.query import Query

from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Message
from asgiref.sync import sync_to_async


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add(
            'chat',
            self.channel_name
        )
        await self.accept()
        prevMessages = await self.previous_messages()
        for message in prevMessages:
            await self.send(text_data=json.dumps({
                'message': message['message'],
                'username': message['user']
            }))

    async def disconnect(self, close_code):
        pass
    
    async def receive(self, text_data): 
        data = json.loads(text_data)
        message = data['message']
        user = data['username']
        
        await self.saveMessage(user, message)
        
        await self.channel_layer.group_send(
            'chat',
            {
                'type': 'chat_message',
                'message': message,
                'username': user
            }
        )

    async def chat_message(self, event):
        message = event['message']
        username = event['username']

        # Mesajı WebSocket'e gönder
        await self.send(text_data=json.dumps({
            'message': message,
            'username': username
        }))


    @sync_to_async
    def saveMessage(self, user, message):
        Message.objects.create(user=user, message=message)
        print('message saved')

    @sync_to_async
    def previous_messages(self):
        messages = list(Message.objects.all().values())
        return messages