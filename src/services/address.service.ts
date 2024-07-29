import { Address, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class AddressService {
    public async getAddressByUserId(id: string): Promise<Address | null> {
        return prisma.address.findUnique({ where: { user_id: id } });
    }
}

export default AddressService;