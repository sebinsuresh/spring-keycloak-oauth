import { HttpInterceptorFn } from "@angular/common/http";

/**
 * Attach credentials - session cookie - to every request.
 * HTTP Client using this should be only used for BFF requests.
 */
export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
    const isBffCall = req.url.startsWith("/api/");
    const withCredentialsMaybe = isBffCall ? req.clone({ withCredentials: true, }) : req;
    return next(withCredentialsMaybe);
};
