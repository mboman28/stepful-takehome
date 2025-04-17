from rest_framework import serializers
from .models import *
from datetime import datetime, timedelta

class StudentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Student 
        fields = ('pk', 'name', 'phone')

class CoachSerializer(serializers.ModelSerializer):

    class Meta:
        model = Coach 
        fields = ('pk', 'name', 'phone')
        
class TimeSlotSerializerIn(serializers.ModelSerializer):
    
    def validate(self, data):
        owner = data['owner'].pk
        startTime = data['startTime']
        twoHrsBefore = startTime - timedelta(hours=2)
        twoHrsAfter = startTime + timedelta(hours=2)
        if 'pk' in self.context.keys():
            qs = TimeSlot.objects.filter(owner=owner, startTime__range=(twoHrsBefore, twoHrsAfter)).exclude(pk=self.context['pk'])
        else:
            qs = TimeSlot.objects.filter(owner=owner, startTime__range=(twoHrsBefore, twoHrsAfter))
            
        if len(qs) != 0:
            raise serializers.ValidationError('This timeslot overlaps with existing timeslots.')

        return data
    
    class Meta:
        model = TimeSlot
        fields = ('pk', 'owner', 'registered', 'startTime')
        
class TimeSlotSerializerOut(serializers.ModelSerializer):
    owner = CoachSerializer()
    registered = StudentSerializer()
    
    class Meta:
        model = TimeSlot
        fields = ('pk', 'owner', 'registered', 'startTime')

class NotesSerializerIn(serializers.ModelSerializer):
    
    def validate(self, data):
        rating = data['rating']
        notes = data['notes']
        
        if rating < 1 or rating > 5:
            raise serializers.ValidationError('Rating must be between 1 and 5.')
        
        if notes == "":
            raise serializers.ValidationError('Notes may not be empty.')
        
        return data
    
    class Meta:
        model = Notes
        fields = ('pk', 'notes', 'rating', 'timeslot')
        
class NotesSerializerOut(serializers.ModelSerializer):
    
    class Meta:
        model = Notes
        fields = ('pk', 'notes', 'rating')
