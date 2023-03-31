import nodemailer, { Transporter } from "nodemailer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
}

interface UserInfo {
  nick: string;
}

export async function addMail(
  header: string,
  txt: string,
  userId: number
): Promise<void> {
  const user: UserInfo | null = await prisma.paUsers.findUnique({
    where: {
      id: userId,
    },
    select: {
      nick: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const nick = user.nick;

  /*const mail = await prisma.mail.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
      header,
      news: txt,
      seen: false,
      time: new Date(),
    },
  });*/

  const transporter: Transporter = nodemailer.createTransport({
    // configure your email provider here
  });

  const mailOptions: MailOptions = {
    from: "your.email@example.com",
    to: "recipient.email@example.com",
    subject: header,
    text: txt,
  };

  //const info = await transporter.sendMail(mailOptions);
  //console.log(`Message sent: ${info.messageId}`);
}

export {};
