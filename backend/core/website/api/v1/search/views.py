from elasticsearch_dsl import Q
from django_elasticsearch_dsl_drf.viewsets import DocumentViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import GenericAPIView
from website.documents import ChannelDocument, TopicDocument
from website.models import Channel
from .serializers import (
    SearchChannelSerializer, SearchTopicSerializer,
    SearchChannel2Serializer
)



class SearchChannelView2(GenericAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        query = request.GET.get('q')
        
        if query:
            print("####################################")
            # MySQL-compatible fallback: simple icontains search
            channels = Channel.objects.filter(
                title__icontains=query
            ) | Channel.objects.filter(
                about__icontains=query
            )
            channels = channels.distinct()
            serializer = SearchChannel2Serializer(
                channels, 
                many=True, 
                context={"user":request.user}
            )
            return Response(serializer.data, status=200)
        else:
            return Response({}, status=200)
        

class SearchChannelView(DocumentViewSet):
    document = ChannelDocument
    serializer_class = SearchChannelSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        query = request.query_params.get('q')  # Get the search query from the request parameters

        if query:
            # Perform the search using Elasticsearch DSL with fuzzy matching and close word hits
            self.search = self.search.query(
                'bool',
                should=[
                    Q('match', title={'query': query, 'fuzziness': 'AUTO'}),
                    Q('match_phrase_prefix', title={'query': query, 'slop': 10, 'max_expansions': 50})
                ],
                minimum_should_match=1
            )
            response = self.search.execute()
            results = response.hits
        else:
            results = []

        # Paginate the search results
        page = self.paginate_queryset(results)
        if page is not None:
            serializer = self.serializer_class(page, many=True)
            return self.get_paginated_response(serializer.data, context={"request":self.request})

        # Return the search results
        serializer = self.serializer_class(results, many=True, context={"request":self.request})
        return Response(serializer.data)
    

class SearchTopicView(DocumentViewSet):
    document = TopicDocument
    serializer_class = SearchTopicSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        query = request.query_params.get('q')  # Get the search query from the request parameters

        if query:
            # Perform the search using Elasticsearch DSL with fuzzy matching and close word hits
            self.search = self.search.query(
                'bool',
                should=[
                    Q('match', name={'query': query, 'fuzziness': 'AUTO'}),
                    Q('match_phrase_prefix', name={'query': query, 'slop': 10, 'max_expansions': 50})
                ],
                minimum_should_match=1
            )
            response = self.search.execute()
            results = response.hits
        else:
            results = []

        # Paginate the search results
        page = self.paginate_queryset(results)
        if page is not None:
            serializer = self.serializer_class(page, many=True)
            return self.get_paginated_response(serializer.data, context={"request":self.request})

        # Return the search results
        serializer = self.serializer_class(results, many=True, context={"request":self.request})
        return Response(serializer.data)