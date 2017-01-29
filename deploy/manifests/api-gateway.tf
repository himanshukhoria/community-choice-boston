resource "aws_api_gateway_rest_api" "api" {
    name = "${var.resource_prefix}-api"
    description = ""
    lifecycle {
        ignore_changes = ["description", "name"]
    }
}

resource "aws_api_gateway_deployment" "v1" {
    stage_name = "v1"
    rest_api_id = "${aws_api_gateway_rest_api.api.id}"
}

resource "null_resource" "upload_swagger" {
    triggers = {
        api = "${aws_api_gateway_rest_api.api.id}"
        stage = "${aws_api_gateway_deployment.v1.stage_name}"
        content = "${sha256(file("./swagger.yml"))}"
        domain = "${var.domain_fqdn}"
        lambda = "${aws_lambda_function.handler.arn}"
        iam = "${aws_iam_role.api_gateway_invoke_lambda.arn}"
    }

    provisioner "local-exec" {
        command = <<EOF
            API_ID=${aws_api_gateway_rest_api.api.id} \
            STAGE_ID=${aws_api_gateway_deployment.v1.stage_name} \
            SWAGGER_SHA=${sha256(file("./swagger.yml"))} \
            DOMAIN=${var.domain_fqdn} \
            LAMBDA_ARN=${aws_lambda_function.handler.arn} \
            IAM_INVOKE_ARN=${aws_iam_role.api_gateway_invoke_lambda.arn} \
            node ./manifests/scripts/uploadSwagger.js
EOF
    }
}
