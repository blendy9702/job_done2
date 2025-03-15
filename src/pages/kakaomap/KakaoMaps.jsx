import { useEffect } from "react";

const KakaoMaps = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_KEY}&autoload=false&libraries=services`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.978),
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);

        const marker = new window.kakao.maps.Marker({
          position: map.getCenter(),
        });
        marker.setMap(map);
      });
    };
  }, []);

  return (
    <div>
      <h1>카카오 지도</h1>
      <div>
        <div id="map" style={{ width: 500, height: 500 }}></div>
      </div>
    </div>
  );
};
export default KakaoMaps;
