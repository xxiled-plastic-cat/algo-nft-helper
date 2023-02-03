
import { decodeAddress } from 'algosdk'
import { CID } from 'multiformats/cid'
import * as mfsha2 from 'multiformats/hashes/sha2'
import * as digest from 'multiformats/hashes/digest'

export const ARC3_NAME_SUFFIX = '@arc3'
export const ARC3_URL_SUFFIX = '#arc3'
export const METADATA_FILE = 'metadata.json'
export const JSON_TYPE = 'application/json'
const proxy_path = 'https://algogator.mypinata.cloud/ipfs/';

export function resolveProtocol(url, reserveAddr) {

    if (url.endsWith(ARC3_URL_SUFFIX))
        url = url.slice(0, url.length - ARC3_URL_SUFFIX.length)

    let chunks = url.split('://')
    // Check if prefix is template-ipfs and if {ipfscid:..} is where CID would normally be
    if (chunks[0] === 'template-ipfs' && chunks[1].startsWith('{ipfscid:')) {
        // Look for something like: template:ipfs://{ipfscid:1:raw:reserve:sha2-256} and parse into components
        chunks[0] = 'ipfs'
        const cidComponents = chunks[1].split(':')
        if (cidComponents.length !== 5) {
            // give up
            console.log('unknown ipfscid format')
            return url
        }
        const [, cidVersion, cidCodec, asaField, cidHash] = cidComponents

        // const cidVersionInt = parseInt(cidVersion) as CIDVersion
        if (cidHash.split('}')[0] !== 'sha2-256') {
            console.log('unsupported hash:', cidHash)
            return url
        }
        if (cidCodec !== 'raw' && cidCodec !== 'dag-pb') {
            console.log('unsupported codec:', cidCodec)
            return url
        }
        if (asaField !== 'reserve') {
            console.log('unsupported asa field:', asaField)
            return url
        }
        let cidCodecCode
        if (cidCodec === 'raw') {
            cidCodecCode = 0x55
        } else if (cidCodec === 'dag-pb') {
            cidCodecCode = 0x70
        }

        // get 32 bytes Uint8Array reserve address - treating it as 32-byte sha2-256 hash
        const addr = decodeAddress(reserveAddr)
        const mhdigest = digest.create(mfsha2.sha256.code, addr.publicKey)


        const cid = CID.create(parseInt(cidVersion), cidCodecCode, mhdigest)
        chunks[1] = cid.toString() + '/' + chunks[1].split('/').slice(1).join('/')
    }

    //Switch on the protocol
    switch (chunks[0]) {
        case 'ipfs': {
            return proxy_path + chunks[1]
        }
        case 'https': //Its already http, just return it
            return url
        // TODO: Future options may include arweave or algorand
    }

    return url
}

