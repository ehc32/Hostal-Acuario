import { prisma } from '../lib/prisma';
import { hashPassword } from '../lib/auth-utils';

async function main() {
    console.log('Verifying setup...');

    try {
        const hash = await hashPassword('test');
        console.log('Bcrypt hash:', hash);
    } catch (e) {
        console.error('Bcrypt error:', e);
    }

    try {
        const userCount = await prisma.user.count();
        console.log('User count:', userCount);
    } catch (e) {
        console.error('Prisma error:', e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
