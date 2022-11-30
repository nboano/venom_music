<h1 align="center">VENOM MUSIC</h1>

>***The best way to listen to your music, freely.***

<img src="https://github.com/nboano/venom_music/blob/master/assets/icons/icon-284x284.png?raw=true" style='display:block;margin:0 auto;'>

### Visit the website clicking **[here](https://www.venommusic.tk "here")**.
<small>(or, if you want to access Venom using TOR, ***[here](http://venom.xdkejwcxdisusd6f5kdpnqkmiwknsukzxhziqdmp3mitgeou3ui4leyd.onion/ "here")***.)</small>

### FUNCTIONS
- Search whatever song you like (all the songs on YT Music are present, and all the videos on YT too)
- Group your favourite songs in the "Liked" list.
- Share your library with others using WebRTC (check Settings)
- Download any song, and listen offline.
- Song Lyrics
- MP3 download with complete metadata (Artwork, Title, Artist, Lyrics)
- **NO ADS**
- Installable as a PWA, perfect on IOS and Android
- Perfect on desktop too

<i class="fa fa-flag"></i> Currently available in <b>ITALIAN</b> and <b>ENGLISH</b>.

------------
### Screenshots
<table>
<tr>
    <td><img src="https://github.com/nboano/venom_music/blob/master/assets/screenshots/screenshot1.PNG?raw=true"/></td>
    <td><img src="https://github.com/nboano/venom_music/blob/master/assets/screenshots/screenshot2.PNG?raw=true"/></td>
    <td><img src="https://github.com/nboano/venom_music/blob/master/assets/screenshots/screenshot3.PNG?raw=true"/></td>
</tr>
</table>


------------

<small><i>APIs Specific Functions usage (for developers)</i></small>

- ## YouTube Music API *(unofficial)*
    <small>Script: ```api/ytmusic.js```</small>

```javascript
class YTMusic { ... }
```
```javascript
    static async YTMusic.init();
```

 Initialises the class. You must include ```cors.js``` and call ```CORS.init(PROXY_URL)``` before executing this method. You must call this method before the others, otherwise they won't work.

```javascript
    static async YTMusic.search(query, categoryName = "SONG"|"VIDEO"|"ARTIST"|"PLAYLIST"|..., pageLimit = 1);
```
    
  Performs a search on YouTube Music. If a category name is specified, the method will search only that category; If nothing is specified as second param, it will look for all the categories.