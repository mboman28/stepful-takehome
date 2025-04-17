from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from datetime import datetime, timedelta
from datetime import date as dateobj

from .models import *
from .serializers import *

@api_view(['GET'])
def students_list(request):
    data = Student.objects.all()

    serializer = StudentSerializer(data, context={'request': request}, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def students_detail(request, pk):
    try:
        student = Student.objects.get(pk=pk)
    except Student.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = StudentSerializer(student, context={'request': request})

    return Response(serializer.data)


@api_view(['GET'])
def coaches_list(request):
    data = Coach.objects.all()

    serializer = CoachSerializer(data, context={'request': request}, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def coaches_detail(request, pk):
    try:
        coach = Coach.objects.get(pk=pk)
    except Coach.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = CoachSerializer(coach, context={'request': request})
    return Response(serializer.data)

@api_view(['GET', 'POST'])
def timeslots_list(request):
    if request.method == 'GET':
        owner = request.query_params.get('owner')
        registered = request.query_params.get('registered')
        date = request.query_params.get('date')
        past = request.query_params.get('past') is not None and request.query_params.get('past').lower() == 'true'
        future = request.query_params.get('future') is not None and request.query_params.get('future').lower() == 'true'
        free = request.query_params.get('free') is not None and request.query_params.get('free').lower() == 'true'
        unregistered = request.query_params.get('unregistered') is not None and request.query_params.get('unregistered').lower() == 'true'
        
        if registered is not None and free:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if registered is not None and unregistered:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if free and unregistered:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if (past or future) and date:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        data = TimeSlot.objects.all()
        if owner is not None:
            data = data.filter(owner=owner)
        if registered is not None:
            data = data.filter(registered=registered)
        if free:
            data = data.filter(registered__isnull=True)
        if unregistered:
            data = data.filter(registered__isnull=False)
        if past and not future:
            data = data.filter(startTime__lte=datetime.now() - timedelta(hours=2))
        if future and not past:
            data = data.filter(startTime__gte=datetime.now())
        if date:
            y, m, d = date.split('-')
            data = data.filter(startTime__date=dateobj(int(y), int(m), int(d)))
            

        serializer = TimeSlotSerializerOut(data, context={'request': request}, many=True)

        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = TimeSlotSerializerIn(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def timeslots_detail(request, pk):
    try:
        timeslot = TimeSlot.objects.get(pk=pk)
    except TimeSlot.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':

        serializer = TimeSlotSerializerOut(timeslot)

        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = TimeSlotSerializerIn(timeslot, data=request.data, context={'pk': pk})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        timeslot.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['GET', 'POST'])
def notes_list(request):
    
    if request.method == 'GET':
        timeslot = request.query_params.get('timeslot')
        if timeslot is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        data = Notes.objects.filter(timeslot=timeslot)
        if len(data) > 1:
            return Response(status=status.HTTP_409_CONFLICT)
        if len(data) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = NotesSerializerOut(data[0], context={'request': request})

        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = NotesSerializerIn(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
def notes_detail(request, pk):
    try:
        notes = Notes.objects.get(pk=pk)
    except Notes.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':

        serializer = NotesSerializerOut(notes, context={'request': request})

        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = NotesSerializerIn(notes, data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)