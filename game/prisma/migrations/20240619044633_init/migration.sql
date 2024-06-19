-- CreateTable
CREATE TABLE "PaUsers" (
    "id" SERIAL NOT NULL,
    "nick" TEXT NOT NULL,
    "crystal" INTEGER NOT NULL DEFAULT 0,
    "metal" INTEGER NOT NULL DEFAULT 0,
    "energy" INTEGER NOT NULL DEFAULT 0,
    "r_energy" INTEGER NOT NULL DEFAULT 0,
    "sats" INTEGER NOT NULL DEFAULT 0,
    "infinitys" INTEGER NOT NULL DEFAULT 0,
    "wraiths" INTEGER NOT NULL DEFAULT 0,
    "warfrigs" INTEGER NOT NULL DEFAULT 0,
    "destroyers" INTEGER NOT NULL DEFAULT 0,
    "scorpions" INTEGER NOT NULL DEFAULT 0,
    "astropods" INTEGER NOT NULL DEFAULT 0,
    "cobras" INTEGER NOT NULL DEFAULT 0,
    "infinitys_base" INTEGER NOT NULL DEFAULT 0,
    "wraiths_base" INTEGER NOT NULL DEFAULT 0,
    "warfrigs_base" INTEGER NOT NULL DEFAULT 0,
    "destroyers_base" INTEGER NOT NULL DEFAULT 0,
    "scorpions_base" INTEGER NOT NULL DEFAULT 0,
    "astropods_base" INTEGER NOT NULL DEFAULT 0,
    "cobras_base" INTEGER NOT NULL DEFAULT 0,
    "p_scorpions" INTEGER NOT NULL DEFAULT 0,
    "p_scorpions_eta" INTEGER NOT NULL DEFAULT 0,
    "p_cobras" INTEGER NOT NULL DEFAULT 0,
    "p_cobras_eta" INTEGER NOT NULL DEFAULT 0,
    "missiles" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER NOT NULL DEFAULT 0,
    "asteroids" INTEGER NOT NULL DEFAULT 0,
    "asteroid_crystal" INTEGER NOT NULL DEFAULT 0,
    "asteroid_metal" INTEGER NOT NULL DEFAULT 0,
    "ui_roids" INTEGER NOT NULL DEFAULT 0,
    "war" INTEGER NOT NULL DEFAULT 0,
    "def" INTEGER NOT NULL DEFAULT 0,
    "wareta" INTEGER NOT NULL DEFAULT 0,
    "defeta" INTEGER NOT NULL DEFAULT 0,
    "r_imcrystal" INTEGER NOT NULL DEFAULT 0,
    "r_immetal" INTEGER NOT NULL DEFAULT 0,
    "r_iafs" INTEGER NOT NULL DEFAULT 0,
    "r_aaircraft" INTEGER NOT NULL DEFAULT 0,
    "r_tbeam" INTEGER NOT NULL DEFAULT 0,
    "r_uscan" INTEGER NOT NULL DEFAULT 0,
    "r_oscan" INTEGER NOT NULL DEFAULT 0,
    "p_infinitys" INTEGER NOT NULL DEFAULT 0,
    "p_infinitys_eta" INTEGER NOT NULL DEFAULT 0,
    "p_wraiths" INTEGER NOT NULL DEFAULT 0,
    "p_wraiths_eta" INTEGER NOT NULL DEFAULT 0,
    "p_warfrigs" INTEGER NOT NULL DEFAULT 0,
    "p_warfrigs_eta" INTEGER NOT NULL DEFAULT 0,
    "p_destroyers" INTEGER NOT NULL DEFAULT 0,
    "p_destroyers_eta" INTEGER NOT NULL DEFAULT 0,
    "p_missiles" INTEGER NOT NULL DEFAULT 0,
    "p_missiles_eta" INTEGER NOT NULL DEFAULT 0,
    "timer" INTEGER NOT NULL DEFAULT 0,
    "size" INTEGER NOT NULL DEFAULT 0,
    "p_astropods" INTEGER NOT NULL DEFAULT 0,
    "p_astropods_eta" INTEGER NOT NULL DEFAULT 0,
    "tag" TEXT NOT NULL DEFAULT '',
    "rank" INTEGER NOT NULL DEFAULT 0,
    "rcannons" INTEGER NOT NULL DEFAULT 0,
    "p_rcannons" INTEGER NOT NULL DEFAULT 0,
    "p_rcannons_eta" INTEGER NOT NULL DEFAULT 0,
    "avengers" INTEGER NOT NULL DEFAULT 0,
    "p_avengers" INTEGER NOT NULL DEFAULT 0,
    "p_avengers_eta" INTEGER NOT NULL DEFAULT 0,
    "lstalkers" INTEGER NOT NULL DEFAULT 0,
    "p_lstalkers" INTEGER NOT NULL DEFAULT 0,
    "p_lstalkers_eta" INTEGER NOT NULL DEFAULT 0,
    "r_odg" INTEGER NOT NULL DEFAULT 0,
    "sleep" INTEGER NOT NULL DEFAULT 0,
    "lastsleep" INTEGER NOT NULL DEFAULT 0,
    "closed" INTEGER NOT NULL DEFAULT 0,
    "x" INTEGER NOT NULL DEFAULT 1,
    "y" INTEGER NOT NULL DEFAULT 1,
    "commander" INTEGER NOT NULL DEFAULT 0,
    "galname" TEXT NOT NULL DEFAULT 'No name',
    "galpic" TEXT NOT NULL DEFAULT '125x125earthdoom1.gif',
    "motd" INTEGER NOT NULL DEFAULT 0,
    "vote" TEXT NOT NULL DEFAULT '',
    "civilians" INTEGER NOT NULL DEFAULT 1000,
    "tax" INTEGER NOT NULL DEFAULT 20,
    "credits" INTEGER NOT NULL DEFAULT 5000,
    "newbie" INTEGER NOT NULL DEFAULT 100,
    "paConstructId" INTEGER,

    CONSTRAINT "PaUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaConstruct" (
    "id" SERIAL NOT NULL,
    "c_crystal" INTEGER NOT NULL DEFAULT 0,
    "c_metal" INTEGER NOT NULL DEFAULT 0,
    "c_airport" INTEGER NOT NULL DEFAULT 0,
    "c_abase" INTEGER NOT NULL DEFAULT 0,
    "c_wstation" INTEGER NOT NULL DEFAULT 0,
    "c_amp1" INTEGER NOT NULL DEFAULT 0,
    "c_amp2" INTEGER NOT NULL DEFAULT 0,
    "c_warfactory" INTEGER NOT NULL DEFAULT 0,
    "c_destfact" INTEGER NOT NULL DEFAULT 0,
    "c_scorpfact" INTEGER NOT NULL DEFAULT 0,
    "c_energy" INTEGER NOT NULL DEFAULT 0,
    "c_odg" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PaConstruct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaNews" (
    "id" SERIAL NOT NULL,
    "sentTo" INTEGER NOT NULL DEFAULT 0,
    "time" INTEGER NOT NULL DEFAULT 0,
    "news" TEXT NOT NULL,
    "seen" TEXT NOT NULL DEFAULT '',
    "header" TEXT NOT NULL,

    CONSTRAINT "PaNews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaLogging" (
    "id" SERIAL NOT NULL,
    "subject" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "author" INTEGER NOT NULL DEFAULT 0,
    "stamp" INTEGER NOT NULL DEFAULT 0,
    "toid" INTEGER NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL,
    "ip" TEXT NOT NULL,

    CONSTRAINT "PaLogging_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaTag" (
    "id" SERIAL NOT NULL,
    "tag" TEXT NOT NULL,
    "leader" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "PaTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaMail" (
    "id" SERIAL NOT NULL,
    "sentTo" INTEGER NOT NULL DEFAULT 0,
    "time" INTEGER NOT NULL DEFAULT 0,
    "news" TEXT NOT NULL,
    "seen" INTEGER NOT NULL DEFAULT 0,
    "header" TEXT NOT NULL,

    CONSTRAINT "PaMail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaPolitics" (
    "id" SERIAL NOT NULL,
    "time" INTEGER NOT NULL DEFAULT 0,
    "tekst" TEXT NOT NULL,
    "x" INTEGER NOT NULL DEFAULT 1,
    "creator" TEXT NOT NULL,
    "threadid" TEXT NOT NULL,
    "header" TEXT NOT NULL,

    CONSTRAINT "PaPolitics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaAlliance" (
    "id" SERIAL NOT NULL,
    "time" INTEGER NOT NULL DEFAULT 0,
    "tekst" TEXT NOT NULL,
    "alliance" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "threadid" TEXT NOT NULL,
    "header" TEXT NOT NULL,

    CONSTRAINT "PaAlliance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaSession" (
    "id" SERIAL NOT NULL,
    "nick" TEXT NOT NULL,
    "userid" INTEGER NOT NULL,
    "magicnumber" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "PaSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaWar" (
    "id" SERIAL NOT NULL,
    "attacker" INTEGER NOT NULL,
    "defender" INTEGER NOT NULL,

    CONSTRAINT "PaWar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reset" (
    "id" SERIAL NOT NULL,
    "nextreset" INTEGER NOT NULL DEFAULT 10080,
    "game_start" INTEGER NOT NULL DEFAULT 0,
    "game_reset" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Reset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PaUsers_nick_idx" ON "PaUsers"("nick");

-- CreateIndex
CREATE INDEX "PaUsers_paConstructId_idx" ON "PaUsers"("paConstructId");

-- CreateIndex
CREATE UNIQUE INDEX "PaUsers_nick_key" ON "PaUsers"("nick");

-- CreateIndex
CREATE INDEX "PaConstruct_id_idx" ON "PaConstruct"("id");

-- CreateIndex
CREATE INDEX "PaNews_sentTo_idx" ON "PaNews"("sentTo");

-- CreateIndex
CREATE INDEX "PaTag_tag_password_idx" ON "PaTag"("tag", "password");

-- CreateIndex
CREATE UNIQUE INDEX "PaTag_tag_password_key" ON "PaTag"("tag", "password");

-- CreateIndex
CREATE INDEX "PaMail_sentTo_idx" ON "PaMail"("sentTo");
