import os
import django
import random
from faker import Faker

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings') 
django.setup()

from app.models import Product 

fake = Faker()

for _ in range(100):
    product = Product.objects.create(
        name=fake.unique.word().capitalize() + " " + fake.word().capitalize(),
        brand=fake.company(),
        category=random.choice(["Electronics", "Books", "Textiles"]),
        description=fake.text(max_nb_chars=200),
        price=round(random.uniform(10.0, 500.0), 2),
        countInStock=random.randint(1, 100),
        image=f"https://picsum.photos/seed/{random.randint(1, 1000)}/600/400"
    )
    print(f"Created product: {product.name}")
