from rest_framework import serializers

class ChatPayloadSerialize(serializers.Serializer):
    q = serializers.CharField(allow_blank=False, trim_whitespace=True)