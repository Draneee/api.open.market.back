-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(45) NOT NULL,
    "rol" VARCHAR(45) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "nickname" VARCHAR(45) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" SERIAL NOT NULL,
    "SKU" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "pictureUrl" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "cloudinaryId" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_SKU_key" ON "Inventory"("SKU");

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
