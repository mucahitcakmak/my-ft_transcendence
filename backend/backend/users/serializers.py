from rest_framework import serializers
from .models import User, Profile, Friendship

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['profile_picture', 'level', 'grade', 'campus']


class CustomUserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:

        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'date_joined', 'profile', 'is_active']

class FriendshipSerializer(serializers.ModelSerializer):
    from_user = CustomUserSerializer()
    to_user = CustomUserSerializer()

    class Meta:
        model = Friendship
        fields = ('id', 'from_user', 'to_user', 'created_at')

class FriendUserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['username', 'email', 'profile_picture', 'first_name', 'last_name']

    def get_profile_picture(self, obj):
        profile = Profile.objects.get(user=obj)
        if profile and profile.profile_picture:
            return profile.profile_picture
        return None