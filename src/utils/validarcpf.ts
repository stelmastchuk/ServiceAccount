import { cpf as cpfvalidator } from 'cpf-cnpj-validator';
import { AppError } from 'src/errors/AppError';

export const validarCpf = (cpf: string): string => {

    const cpfValido = cpfvalidator.isValid(cpf)

    if (!cpfValido) {
        throw new AppError("Cpf invalid!")
    }

    const cpfformatado = cpfvalidator.format(cpf)

    return cpfformatado

}