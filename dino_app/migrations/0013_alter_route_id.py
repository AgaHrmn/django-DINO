# Generated by Django 5.1.3 on 2025-01-23 22:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dino_app', '0012_alter_route_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='route',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
