import axios from 'axios';
import { resolveProtocol } from './arc19.js'

const proxy_path = 'https://algogator.mypinata.cloud/ipfs/';

const parseNFTImage = async (nft) => {
    let ipfs_proxy = '';
    if (nft && nft['params'] && nft['params']['url']) {
        if (nft['params'] && nft['params']['url'].startsWith('https://gateway.pinata.cloud/ipfs/')) {
            ipfs_proxy = `${proxy_path}${nft['params']['url'].split('https://gateway.pinata.cloud/ipfs/')[1]}`;
        }

        if (nft['params'] && nft['params']['url'].startsWith('https://ipfs.io/ipfs/')) {
            ipfs_proxy = `${proxy_path}${nft['params']['url'].split('https://ipfs.io/ipfs/')[1]}`;
        }

        if (nft['params'] && nft['params']['url'].startsWith('ipfs://')) {
            ipfs_proxy = `${proxy_path}${nft['params']['url'].split('ipfs://')[1]}`;
        }

        if (nft['params'] && nft['params']['url'].startsWith('template')) {

            ipfs_proxy = nft['params']['url'];
            let arc19url = resolveProtocol(ipfs_proxy, nft['params']['reserve'])
            console.log('nft parser, arc19url', arc19url)
            const response = await axios.get(arc19url);
            if (response.headers.get('Content-Type') === 'application/json') {
                let {data} = await axios.get(ipfs_proxy);
                let arc3ImageURL = data['image'];
                if (arc3ImageURL.startsWith('ipfs://')) ipfs_proxy = `https://algogator.mypinata.cloud/ipfs/${arc3ImageURL.split('ipfs://')[1]}`;

            } else {
                ipfs_proxy = arc19url;
            }

        }

        if (nft['params'] && nft['params']['url'].includes('arc3')) {
            const response = await axios.get(ipfs_proxy);
            if (response.headers['content-type'] === 'application/json') {
                const {data} = await axios.get(ipfs_proxy);
                let arc3ImageURL = data['image'];
                if (arc3ImageURL.startsWith('ipfs://')) arc3ImageURL = `https://algogator.mypinata.cloud/ipfs/${arc3ImageURL.split('ipfs://')[1]}`;
                ipfs_proxy = arc3ImageURL;
            }
            else {
                return ipfs_proxy;
            }
        }

        return ipfs_proxy;
    }
}

const parseNFTImage2 = async (nft) => {
    try {
        let ipfs_proxy = '';
        if (nft && nft['params'] && nft['params']['url'] && !nft['params']['url'].includes('infura')) {
            if (nft && nft['params'] && nft['params']['url']) {
                if (nft['params'] && nft['params']['url'].startsWith('https://gateway.pinata.cloud/ipfs/')) {
                    ipfs_proxy = `${proxy_path}${nft['params']['url'].split('https://gateway.pinata.cloud/ipfs/')[1]}`;
                }

                if (nft['params'] && nft['params']['url'].startsWith('https://ipfs.io/ipfs/')) {
                    ipfs_proxy = `${proxy_path}${nft['params']['url'].split('https://ipfs.io/ipfs/')[1]}`;
                }

                if (nft['params'] && nft['params']['url'].startsWith('ipfs://')) {
                    ipfs_proxy = `${proxy_path}${nft['params']['url'].split('ipfs://')[1]}`;
                }

                if (nft['params'] && nft['params']['url'].startsWith('template')) {

                    ipfs_proxy = nft['params']['url'];
                    let arc19url = resolveProtocol(ipfs_proxy, nft['params']['reserve'])
                    const response = await axios.get(arc19url);
                    if (response.headers['content-type'] === 'application/json') {
                        let arc3Data = await response.data;
                        let arc3ImageURL = arc3Data['image'];
                        if (arc3ImageURL.startsWith('ipfs://')) ipfs_proxy = `https://algogator.mypinata.cloud/ipfs/${arc3ImageURL.split('ipfs://')[1]}`;

                    } else {
                        ipfs_proxy = arc19url;
                    }

                }
                if (nft['params'] && nft['params']['url'] && ipfs_proxy === '') {
                    ipfs_proxy = nft['params']['url']
                }

                const response = await axios.head(ipfs_proxy);
                if (response.headers['content-type'] === 'application/json') {
                    const dataResponse = await axios.get(ipfs_proxy);
                    const data = await dataResponse.data;
                    let arc3ImageURL = data['image'];
                    if (arc3ImageURL.startsWith('ipfs://')) arc3ImageURL = `https://algogator.mypinata.cloud/ipfs/${arc3ImageURL.split('ipfs://')[1]}`;
                    ipfs_proxy = arc3ImageURL;
                }
                else {
                    return ipfs_proxy;
                }


                return ipfs_proxy;
            }
        }
    } catch (err) {
        console.log(err);
    }
}

export {
    parseNFTImage,
    parseNFTImage2
}