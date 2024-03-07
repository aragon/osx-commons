import {ENS_REGEX, IPFS_URI_REGEX, SUBDOMAIN_REGEX} from './constants';
import {InvalidCidError} from './errors';
import {MultiUri} from './multiuri';

/**
 * Attempts to parse the given string as a URL and returns the IPFS CiD contained in it.
 * Alternatively it tries to use the raw value after validating it.
 *
 * @export
 * @param {string} data
 * @return {*}  {string}
 */
export function resolveIpfsCid(data: string): string {
  const uri = new MultiUri(data);
  const cid = uri.ipfsCid;
  if (!cid) {
    throw new InvalidCidError();
  }
  return cid;
}

/**
 * Checks if the given string is a valid ENS name
 *
 * @export
 * @param {string} name
 * @return {*}  {boolean}
 */
export function isEnsName(name: string): boolean {
  const regex = new RegExp(ENS_REGEX);
  return regex.test(name);
}

/**
 * Checks if the given string is a valid IPFS URI
 *
 * @export
 * @param {string} cid
 * @return {*}  {boolean}
 */
export function isIpfsUri(cid: string): boolean {
  const regex = new RegExp(IPFS_URI_REGEX);
  return regex.test(cid);
}

/**
 * Checks if the given string is a valid subdomain
 *
 * @export
 * @param {string} name
 * @return {*}  {boolean}
 */
export function isSubdomain(name: string): boolean {
  const regex = new RegExp(SUBDOMAIN_REGEX);
  return regex.test(name);
}
