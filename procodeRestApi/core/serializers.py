from rest_framework import serializers
from rest_framework.response import Response
from rest_framework import status
from .models import *
import xlrd


# Admin: Scheme, Classification, Translation, Data
# User: MyFile, MyData

# Serializers for upload
class SchemeUploadSerializer(serializers.Serializer):
    scheme = serializers.CharField()
    excel = serializers.FileField(label="MS Excel file")

# Machine learning data for a scheme upload from Excel
class DataUploadSerializer(serializers.Serializer):
    scheme = serializers.CharField()
    excel = serializers.FileField(label="MS Excel file")

    LANG = [
        ('en', 'English'),
        ('ge', 'German'),
        ('fr', 'French'),
        ('it', 'Italian')
    ]

    lng = serializers.ChoiceField(
        choices=LANG, label="Language")

# Translation upload
class TranslationUploadSerializer(serializers.Serializer):
    excel = serializers.FileField(label="MS Excel file")
    starting_scheme_id = serializers.CharField()
    output_scheme_id = serializers.CharField()


# Serializers for viewsets ------------------------------------
class SchemeSerializer(serializers.ModelSerializer):
    CHOICES = [
        ('O', 'Occupations'),
        ('E', 'Economic sectors')
    ]

    stype = serializers.ChoiceField(
        choices=CHOICES,
        label = "Scheme type"
    )
    class Meta:
        model = Scheme
        fields = '__all__'
        

class ClassificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classification
        fields = '__all__'

class TranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Translation
        fields = '__all__'

# Machine learning data -> train CNB
class DataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Data
        fields = '__all__'

    LANG = [
        ('en', 'English'),
        ('ge', 'German'),
        ('fr', 'French'),
        ('it', 'Italian')
    ]

    lng = serializers.ChoiceField(
        choices=LANG,
        label="Language")
    
    # since data_tokens is required in model
    # we make its validation to read_only and thus not required
    # but actually it is -> but after it is passed through create
    # we pass data (raw text) through tokenization and then save
    tokens = serializers.CharField(read_only=True)


# End-user serializers ----------------------------------------------
class MyDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyData
        fields = '__all__'

class MyFileSerializer(serializers.ModelSerializer):
    LANG = [
        ('en', 'English'),
        ('ge', 'German'),
        ('fr', 'French'),
        ('it', 'Italian')
    ]

    lng = serializers.ChoiceField(
        choices=LANG, label="Language")

    my_data = serializers.StringRelatedField(many=True)

    class Meta:
        model = MyFile 
        fields = '__all__'

# upload serializer ------------------------------------------------
class MyFileUploadSerializer(serializers.Serializer):
    excel = serializers.FileField(label="MS Excel file")
    my_file = serializers.CharField()