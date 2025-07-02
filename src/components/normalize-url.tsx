import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function fullyNormalizeUrl(url: string): string {
  const unicodeNormalized = url.replace(
    /\\u([\dA-Fa-f]{4})/g,
    function (match, group) {
      return String.fromCharCode(parseInt(group, 16));
    }
  );
  return unicodeNormalized;
}

function NormalizeUrl() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const rawUrl = window.location.href;
    const normalizedUrl = fullyNormalizeUrl(rawUrl);

    if (rawUrl !== normalizedUrl) {
      // Yalnızca pathname ve search kısmını alın
      const newUrl = new URL(normalizedUrl);
      const pathAndSearch = newUrl.pathname + newUrl.search;

      // Kullanıcıyı normalize edilmiş URL'ye yönlendirin
      navigate(pathAndSearch, { replace: true });
    }
  }, [location, navigate]);

  return null; // Bu bileşen herhangi bir şey render etmez
}

export default NormalizeUrl;
