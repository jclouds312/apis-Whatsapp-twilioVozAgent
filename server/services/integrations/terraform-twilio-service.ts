
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

export class TerraformTwilioService {
  private terraformDir: string;

  constructor() {
    this.terraformDir = path.join(__dirname, '../../../terraform-twilio');
  }

  async initializeTerraform() {
    try {
      const { stdout, stderr } = await execAsync('terraform init', {
        cwd: this.terraformDir
      });
      return { status: 'initialized', output: stdout, error: stderr };
    } catch (error: any) {
      throw new Error(`Terraform init failed: ${error.message}`);
    }
  }

  async planInfrastructure(variables: {
    accountSid?: string;
    authToken?: string;
    phoneNumber?: string;
  }) {
    const tfVarsPath = path.join(this.terraformDir, 'terraform.tfvars');
    
    const tfVars = `
account_sid = "${variables.accountSid || process.env.TWILIO_ACCOUNT_SID}"
auth_token = "${variables.authToken || process.env.TWILIO_AUTH_TOKEN}"
phone_number = "${variables.phoneNumber || ''}"
    `.trim();

    await fs.writeFile(tfVarsPath, tfVars);

    try {
      const { stdout } = await execAsync('terraform plan', {
        cwd: this.terraformDir
      });
      return { status: 'planned', output: stdout };
    } catch (error: any) {
      throw new Error(`Terraform plan failed: ${error.message}`);
    }
  }

  async applyInfrastructure(autoApprove: boolean = false) {
    try {
      const command = autoApprove ? 'terraform apply -auto-approve' : 'terraform apply';
      const { stdout } = await execAsync(command, {
        cwd: this.terraformDir
      });
      return { status: 'applied', output: stdout };
    } catch (error: any) {
      throw new Error(`Terraform apply failed: ${error.message}`);
    }
  }

  async destroyInfrastructure() {
    try {
      const { stdout } = await execAsync('terraform destroy -auto-approve', {
        cwd: this.terraformDir
      });
      return { status: 'destroyed', output: stdout };
    } catch (error: any) {
      throw new Error(`Terraform destroy failed: ${error.message}`);
    }
  }

  async getOutputs() {
    try {
      const { stdout } = await execAsync('terraform output -json', {
        cwd: this.terraformDir
      });
      return JSON.parse(stdout);
    } catch (error: any) {
      throw new Error(`Failed to get Terraform outputs: ${error.message}`);
    }
  }
}
