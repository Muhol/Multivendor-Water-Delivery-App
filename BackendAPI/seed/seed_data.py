import asyncio
from faker import Faker
from sqlalchemy.ext.asyncio import AsyncSession
from db.session import AsyncSessionLocal
from models.deliverer_model import Deliverer
from models.product_model import Product
from models.vendor_model import Vendor
from datetime import datetime, time, timezone
from geoalchemy2.shape import from_shape
from shapely.geometry import Point
import random
import uuid

faker = Faker()

# Cloudinary Image URLs
productImages = [
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749059743/zjfoz5vc9pw9dzn7jpuh.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749059894/wsoofb5s4g9yct2vflzl.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749059929/rm2385bzx9z6exlagnnb.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749059961/f7gcwn9morh82qxrqez6.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749059986/urtwpykytnl6ilwpppgm.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749060012/qi85i3x93rndfzj3ns3r.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749060048/kwcms2i9ezc33qn3a5il.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749060077/qroz7nc5gzmbp5eoknjk.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749060111/cogawqlc2vhypwrflrxn.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749060134/hdpjyjykk5oqi6jd7kdw.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749060169/rctalphfnadgl3dscsfa.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749060201/bmpltj6ls6gytzxfblnk.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749060228/grj3hiy2y4cjefodlden.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749060251/veowb8nguwwlboirlgho.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749060281/vwioru36ccaxa2vwrat9.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749060308/vwbrtlmth8wtbllnlmac.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749060330/dquatvstkcpxbepwiiv7.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749060365/an2uop1xk4gg7zk3pqx2.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749060380/tci21dklgnygb1uaocju.jpg"
]

vendorProfilePics = [
    # "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749060591/to8zdm6xzme2kuopyk0n.jpg",
    # "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749060655/sxyi3eziuw2t8ad14fe8.jpg",
    # "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749060790/xqkh4vybgal1vvvjw0fm.jpg",
    # "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749060863/n2e5r93g9gu5bkdqsfvu.jpg",
    # "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749063268/bfgtxoob6jttgrgjg9rm.jpg",
    # "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749063325/iki24xxin5pbkn45u5on.jpg",
    # "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749065871/l11hxxozoda2hsqxvwhv.jpg",
    # "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749065886/ausfsrvkomemfvty36pv.jpg",
    # "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749065914/kuedkwmcqtfuvbw3dtw9.jpg",
    # "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749065937/ebcfn3zlek2mqgls4wk5.jpg",
    # "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749065959/ldf9kkpnr23ncldxpfu4.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749060801/kzhsjnh5e4ka30jr0qtv.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749065804/inei0y4cgkfjum6qy0hk.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749065832/dhocfdjhnxrrsukbqw0k.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749065850/htookfvdhxsgmm8zp5d0.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1749065901/grykkgxrdfxqd5fxxs65.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1751196927/pumoscycxnpcdawqvjw6.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1751196965/ckrydko59jcjpwgfa281.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1751196993/jph6edbeygnpeybc2gda.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1751197089/tyy6re4fbabmrgrfr3h4.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1751197120/ahex7trvp8prpuhnurpc.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1751197145/tsy3ynpathioxw5gulyi.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1751197167/j7io7ev3xvnjqesnv0x7.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1751197189/gks6j8oon4lsaw1ozcph.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1751197238/bjndizyuli3mrxo030zg.jpg",
    "https://res.cloudinary.com/dn5f0jksu/image/upload/v1751197261/eqdvvigrij2iv3rjmcpv.jpg"
]

async def seed_deliverers():
    async with AsyncSessionLocal() as session:
        for _ in range(30):
            lat = random.uniform(-1.45, -1.10)
            lng = random.uniform(36.65, 37.00)
            # lat = random.uniform(51.39, 55.43)
            # lng = random.uniform(-10.56, -5.34)

            deliverer = Deliverer(
                id=uuid.uuid4(),
                name=faker.name(),
                email=faker.unique.email(),
                phone_number=faker.phone_number(),
                profile_pic=faker.image_url(),  # You can also replace this with a static list like above if needed
                driver_license=faker.file_path(extension='pdf'),
                ID_number=faker.unique.ssn(),
                vehicle_type=random.choice(["bike", "car", "foot"]),
                plate_number=faker.license_plate(),
                current_lat=lat,
                current_lng=lng,
                location=from_shape(Point(lng, lat), srid=4326),
                is_available=True,
                is_active=False,
                is_verified=False,
                shift_start=time(7, 0),
                shift_end=time(19, 0),
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc)
            )
            session.add(deliverer)
        await session.commit()
        print("✅ Deliverers seeded.")


vendor_types = ["refill", "retail", "whole_seller", "general"]

async def seed_vendors_and_products():
    async with AsyncSessionLocal() as session:
        for _ in range(15):
            lat = random.uniform(-1.99, 1.30)
            lng = random.uniform(33.65, 40.00)
            # lat = random.uniform(51.39, 55.43)
            # lng = random.uniform(-10.56, -5.34)

            vendor = Vendor(
                owners_name=faker.name(),
                vendor_type=random.choice(vendor_types),  # ✅ Random vendor type
                business_name=faker.company(),
                email=faker.unique.email(),
                phone_number=faker.phone_number(),
                profile_pic=random.choice(vendorProfilePics),
                business_license=faker.file_path(),
                location_address=faker.address(),
                lat=lat,
                lng=lng,
                location=from_shape(Point(lng, lat), srid=4326),
                delivery_radius=round(random.uniform(1.0, 10.0), 1),
                shift_start=time(7, 0),
                shift_end=time(19, 0),
                verification_status="pending",
                rating=round(random.uniform(3.0, 5.0), 1),
                total_sales=random.randint(0, 100),
                sales_amount=round(random.uniform(1000, 10000), 2),
                preferred_payment_method=["cash", "mpesa"]
            )
            session.add(vendor)
            await session.flush()

            # ✅ Add at least 8 products without discount
            for i in range(14):
                price = round(random.uniform(1.0, 50.0), 2)
                discount = 0.0 if i < 8 else round(random.uniform(0.01, price * 0.6), 2)

                product = Product(
                    vendor_id=vendor.id,
                    name=faker.word().capitalize() + " Water",
                    description=faker.text(max_nb_chars=100),
                    image_url=random.choice(productImages),
                    price=price,
                    discount=discount,
                    capacity=round(random.uniform(0.5, 10.0), 1),
                    unit=random.choice(["L", "ml"]),
                    stock=random.randint(10, 100),
                )
                session.add(product)

        await session.commit()
        print("✅ Vendors and products seeded.")

async def main():
    await seed_deliverers()
    await seed_vendors_and_products()

if __name__ == "__main__":
    asyncio.run(main())
