from typing import Optional

from pydantic import Field, HttpUrl, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict()

    # Application Configuration
    chainlit_url: Optional[HttpUrl] = Field(default=None)

    # Postgres database
    pg_db_connection_string: SecretStr = Field()

    # AWS Configuration
    s3_uploads_bucket: str = Field()

    # AWS OAuth Authentication
    oauth_cognito_client_id: str = Field()
    oauth_cognito_client_secret: SecretStr = Field()
    oauth_cognito_domain: str = Field()

    # Azure Document Intelligence Loader Configuration
    azure_doc_api_endpoint: HttpUrl = Field()
    azure_doc_api_key: SecretStr = Field()
    azure_doc_api_model: str = Field()
    azure_doc_api_version: str = Field()

    # OpenAI API Configuration
    openai_api_base: HttpUrl = Field()
    openai_api_key: SecretStr = Field()
    openai_chat_model: str = Field()

    # ClamAV file scanning
    clam_av_scan: Optional[bool] = Field(default=False)
    clam_av_scan_url: Optional[HttpUrl] = Field(default=None)

    # Chat settings
    num_of_messages_in_memory: Optional[int] = Field(default=5)

    # Converge API
    converge_api_url: Optional[HttpUrl] = Field(default=None)
    converge_api_enabled: Optional[bool] = Field(default=False)

settings = Settings()  # type: ignore

__all__ = ["settings"]
