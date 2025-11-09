import prisma from "./prisma/prismaClient.js";
import bcrypt from "bcryptjs";

const createDefaultAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" }
    });

    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.email);
      return;
    }

    // Create default admin
    const hashedPassword = await bcrypt.hash('admin', 10);
    const admin = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    console.log('Default admin created:', admin.email);
    console.log('Email: admin@gmail.com');
    console.log('Password: admin');
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
};

// Create default admin
createDefaultAdmin();
