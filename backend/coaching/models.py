from django.db import models
from django.core.validators import RegexValidator

class Student(models.Model):
    name = models.CharField("Name", max_length=240)
    phone = models.CharField(
        max_length=20,  # Adjust based on your needs
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',  
                message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
            )
        ]
    )

    def __str__(self):
        return self.name

class Coach(models.Model):
    name = models.CharField("Name", max_length=240)
    phone = models.CharField(
        max_length=20,  # Adjust based on your needs
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',  
                message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
            )
        ]
    )

    def __str__(self):
        return self.name


class TimeSlot(models.Model):
    owner = models.ForeignKey(Coach, on_delete=models.CASCADE)
    registered = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, blank=True)
    startTime = models.DateTimeField(blank=False)
    
class Notes(models.Model):
    timeslot = models.ForeignKey(TimeSlot, on_delete=models.CASCADE)
    notes = models.TextField()
    rating = models.IntegerField()
    