using './walrhouse-webapi-containerapp.module.bicep'

param aca_env_outputs_azure_container_apps_environment_default_domain = '{{ .Env.ACA_ENV_AZURE_CONTAINER_APPS_ENVIRONMENT_DEFAULT_DOMAIN }}'
param aca_env_outputs_azure_container_apps_environment_id = '{{ .Env.ACA_ENV_AZURE_CONTAINER_APPS_ENVIRONMENT_ID }}'
param aca_env_outputs_azure_container_registry_endpoint = '{{ .Env.ACA_ENV_AZURE_CONTAINER_REGISTRY_ENDPOINT }}'
param aca_env_outputs_azure_container_registry_managed_identity_id = '{{ .Env.ACA_ENV_AZURE_CONTAINER_REGISTRY_MANAGED_IDENTITY_ID }}'
param walrhouse_webapi_containerimage = '{{ .Image }}'
param walrhouse_webapi_containerport = '{{ targetPortOrDefault 8080 }}'
param walrhousedb_connectionstring = '{{ securedParameter "WalrhouseDb" }}'
