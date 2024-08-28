import { useEffect, useState } from "react";
import { FetchService } from "../services/FetchService";

/* usage :
   ------
  const isAuthorized = useAuthorization(() => {
    if (user) logout();
    navigate("/home");
  });
  const isAuthorized = useAuthorization();
  if (isAuthorized === null) return <p>Loading...</p>;
  if (!isAuthorized) return <p>You are not authorized to view this page.</p>;
 */
const useAuthorization = onNotAuthorized => {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    (async () => {
      const authorized = await FetchService().isAuthorized();
      setIsAuthorized(authorized);
      if (!authorized && typeof onNotAuthorized === "function") {
        onNotAuthorized();
      }
    })();
  }, [onNotAuthorized]);

  return isAuthorized;
};

export default useAuthorization;
