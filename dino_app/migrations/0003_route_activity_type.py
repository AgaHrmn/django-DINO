# Generated by Django 5.1.3 on 2024-12-19 14:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dino_app', '0002_route_length'),
    ]

    operations = [
        migrations.AddField(
            model_name='route',
            name='activity_type',
            field=models.CharField(default='not defined', max_length=200),
            preserve_default=False,
        ),
    ]