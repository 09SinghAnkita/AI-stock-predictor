from rest_framework import serializers

class ChatPayloadSerialize(serializers.Serializer):
    q = serializers.CharField(allowed_blank=False, trim_whitespace=True)