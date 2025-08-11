from decouple import config


class Constants:
    LIVEKIT_API_KEY = config("LIVEKIT_API_KEY", cast=str)
    LIVEKIT_SECRET_KEY = config("LIVEKIT_SECRET_KEY", cast=str)
    PARTICIPANT_PRODUCER_TYPE = "PRODUCER"
    PARTICIPANT_CONSUMER_TYPE = "CONSUMER"
    BASE_MINIO_PATH = config("BASE_MINIO_PATH", cast=str, default="https://62-60-164-69.openvidu-local.dev:7443/minio-console/browser/")