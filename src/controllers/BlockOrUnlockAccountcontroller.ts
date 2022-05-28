import { container } from 'tsyringe'
import { treatError } from 'src/utils/errors';
import { IBlockOrDesblockAccountDTO } from '@repositories/DTO/IGetExtractByDataDTO copy';
import { schemaBlockOrDesblockAccount } from 'src/utils/joiValidation';
import { AppError } from 'src/errors/AppError';
import { validarCpf } from 'src/utils/validarcpf';
import { BlockOrUnlockAccountUseCase } from 'src/UseCases/BlockOrUnlockAccountUseCase';

class BlockOrUnlockAccountController {

    async handler(event: any): Promise<any> {

        try {

            const { cpf, accountStatus } = JSON.parse(event.body) as IBlockOrDesblockAccountDTO

            const { error } = schemaBlockOrDesblockAccount.validate({ accountStatus: accountStatus, cpf: cpf })
            
            if (error) {
                throw new AppError(error.message)
            }

            const cpfvalidado = validarCpf(cpf)


            const blockOrDesblockAccountUseCase = container.resolve(BlockOrUnlockAccountUseCase)

            const response = await blockOrDesblockAccountUseCase.execute(cpfvalidado, accountStatus)

            return {
                statusCode: 200,
                body: JSON.stringify({ account: response ? 'account unlocked' : "account blocked"  }),
                headers: { "Content-type": "application/json" },
            }

        } catch (err) {
            return treatError(err)
        }

    }

}

export { BlockOrUnlockAccountController }