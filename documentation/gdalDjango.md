# For geoDjango to work it needs some free Geospatial libraries, which it uses in the inbuilt django.contrib.gis app and I will be showing you how to install it.

## Step 1: Downloading osgeo4w

For some reason the hosting website https://trac.osgeo.org/osgeo4w/ download link does not work properly, either it won't work at all in chrome or downloads the 32bit in firefox but seems to work alright in the Edge browser an alternative is to use the QGIS link https://qgis.org/en/site/forusers/download.html. You will get a downloaded file as osgeo4w-setup.exe.

## Step 2: Installing it

They say use the Express install which I am sure does not work cause I have tried it at least 30 times and each download cost a little above 500MB. Use the Advance install because that was what worked for me. Click on

1. Next > button
2. Select Install from internet and click Next >
3. Make sure Just Me is selected when ask who to install for and click Next >
4. Maintain the default path on the fourth page unless you have a reason to and click Next >
5. Select Direct Connection and click Next >
6. This next stage was important for my process, from the available sites to download the libraries select http://www.norbit.de thus the 3rd link
7. From here click on Next > until the download starts, you should have at least 600MB of internet bundle to finish the download.

Things might change a little in the future so be cautious.

## Step 3: Modifying Windows environment

Open command prompt in administrative mode for administrative privileges'. You can then copy and paste these one after the other in the order they appear.

This is for win64 systems as of 2022 as it is the one supported, if you are using win32 make sure you download an 32bit version of OSGeo4W/GDAL the same commands will work.

```
set OSGEO4W_ROOT=C:\OSGeo4W
set GDAL_DATA=%OSGEO4W_ROOT%\share\gdal
set PROJ_LIB=%OSGEO4W_ROOT%\share\proj
set PATH=%PATH%;%OSGEO4W_ROOT%\bin
reg ADD "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path /t REG_EXPAND_SZ /f /d "%PATH%"
reg ADD "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment"/v GDAL_DATA /t REG_EXPAND_SZ /f /d "%GDAL_DATA%"
reg ADD "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v PROJ_LIB /t REG_EXPAND_SZ /f /d "%PROJ_LIB%"

See [django doc](https://docs.djangoproject.com/en/4.0/ref/contrib/gis/install/#:~:text=set%20OSGEO4W_ROOT%3DC,f%20/d%20"%25PROJ_LIB%25") for all the commands above.
```


After you are done you can check the environment variables to confirm your changes by typing in the windows search box:

```edit the system environment variables```

Click on the Environment Variables button and in the system variables section scroll and double click on Path. Here you should see your python path and also "C:\OSGeo4W" and "C:\OSGeo4W\bin" if you don't click on New and add it yourself.

When done success click on OK on all open windows go back to your python environment and in the command prompt use pip to install psycopg2 if you will be working with Postgres.

```pip install psycopg2```

## Step 4: Configuring django 
After getting through successfully when you open cmd and type gdalinfo --version you should see the version of gdal installed, but when your run django (python manage.py check or runserser) you will get this error most of the time depending on the version of gdal you installed and if you do not get an error whilst running django you are good to go and no need to follow the rest of the answer.

```raise ImproperlyConfigured(django.core.exceptions.ImproperlyConfigured: Could not find the GDAL library (tried "gdal303", "gdal302", "gdal301", "gdal300", "gdal204", "gdal203", "gdal202", "gdal201", "gdal20"). Is GDAL installed? If it is, try setting GDAL_LIBRARY_PATH in your settings.```

To solve this go to the system folder holding the OSGeo4W most of the time it will be here C:\OSGeo4W open it and locate and open bin as well. Look inside the bin folder for the largest file with the name gdal***.dll.

The *** number if you have a memory span of less than 60 seconds write that number somewhere and go into your python environment where django is installed and navigate to this path:

```..\env\Lib\site-packages\django\contrib\gis\gdal```

and open libgdal.py file with your favorite editor.

Scroll down to line 24, in the lib_names list, add the *** number into the list as a string, mine was 304. So it becomes something like this

```
lib_names = [

    "gdal303",

    "gdal302",

    "gdal301",

    "gdal300",

    "gdal204",

    "gdal203",

    "gdal202",

    "gdal201",

    "gdal20",

    "gdal304",

]
```

Also on line 38 add the version of gdal prefixed with gdal like this "gdal3.4.2", you will get the version when you type gdalinfo --version in command prompt.

**Author - [james morgan](https://stackoverflow.com/questions/71847139/solution-to-installing-gdal-proj-geos-in-windows-10-for-django-geodjango)**