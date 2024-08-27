/**
 * UTM class for generating and parsing UTM parameters in URLs.
 * @class
 *
 * @example
 * // Example of generating a tagged URL
 * const baseUrl = 'https://example.com/products';
 * const utmParams = {
 *     source: 'instagram',
 *     medium: 'social',
 *     campaign: 'summer_sale',
 *     content: 'button_cta',
 * };
 * const taggedUrl = UTM.generateURL(baseUrl, utmParams);
 * console.log('Tagged URL:', taggedUrl);
 *
 * // Example of parsing UTM parameters from a URL
 * const urlWithUTM = 'https://example.com/products?utm_source=instagram&utm_medium=social&utm_campaign=summer_sale&utm_content=button_cta';
 * const parsedParams = UTM.parseURL(urlWithUTM);
 * console.log('Parsed UTM parameters:', parsedParams);
 */
export default class UTM {
    /**
     * Generates a UTM-tagged URL with specified parameters.
     * @param {string} url - The base URL to tag with UTM parameters.
     * @param {Object} params - UTM parameters: source, medium, campaign, term, content.
     * @returns {string} The tagged URL with UTM parameters.
     */
    static generateURL(url, params) {
        const { source, medium, campaign, term, content } = params;
        let taggedURL = url;

        if (source) {
            taggedURL += `?utm_source=${encodeURIComponent(source)}`;
        }
        if (medium) {
            taggedURL += `&utm_medium=${encodeURIComponent(medium)}`;
        }
        if (campaign) {
            taggedURL += `&utm_campaign=${encodeURIComponent(campaign)}`;
        }
        if (term) {
            taggedURL += `&utm_term=${encodeURIComponent(term)}`;
        }
        if (content) {
            taggedURL += `&utm_content=${encodeURIComponent(content)}`;
        }

        return taggedURL;
    }

    /**
     * Parses UTM parameters from a URL query string.
     * @param {string} url - The URL containing UTM parameters.
     * @returns {Object} An object containing parsed UTM parameters.
     */
    static parseURL(url) {
        const queryString = url.split('?')[1];
        if (!queryString) {
            return {};
        }

        const params = new URLSearchParams(queryString);
        return {
            source: params.get('utm_source'),
            medium: params.get('utm_medium'),
            campaign: params.get('utm_campaign'),
            term: params.get('utm_term'),
            content: params.get('utm_content'),
        };
    }
}
