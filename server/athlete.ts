export const getAthleteImage = async (playerName: string) => {
  try {
    // Get the player's image from Wikipedia
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(playerName)}&gsrprop=snippet&prop=imageinfo&iiprop=url&rawcontinue&gsrnamespace=6&format=json`
    const response = await fetch(url);
    const data = await response.json();
    const athleteImage = Object.values(data.query.pages).find((page: any) => page.imageinfo.length > 0)?.imageinfo[0].url;
    return {
      player: playerName,
      image: athleteImage,
    };
  } catch (error) {
    console.error("Athlete Image Error:", error);
    return {
      player: playerName,
      image: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
    };
  }
};