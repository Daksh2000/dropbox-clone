from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import FileResponse
from .models import File
from .serializers import FileSerializer

class FileUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        file_serializer = FileSerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.save()
            return Response(file_serializer.data, status=201)
        return Response(file_serializer.errors, status=400)

class FileListView(APIView):
    def get(self, request):
        files = File.objects.all()
        serializer = FileSerializer(files, many=True)
        return Response(serializer.data)

class FileDownloadView(APIView):
    def get(self, request, file_id):
        file_obj = File.objects.get(id=file_id)
        return FileResponse(file_obj.file, as_attachment=True)