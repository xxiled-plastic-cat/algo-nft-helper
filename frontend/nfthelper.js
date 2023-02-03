import { resolveProtocol } from './arc19.js'

const proxy_path = ''; //add your proxy ipfs node

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
            const response = await fetch(arc19url);
            if (response.headers.get('Content-Type') === 'application/json') {
                let arc3Data = await response.json();
                let arc3ImageURL = arc3Data['image'];
                if (arc3ImageURL.startsWith('ipfs://')) ipfs_proxy = `${proxy_path}/${arc3ImageURL.split('ipfs://')[1]}`;

            } else {
                ipfs_proxy = arc19url;
            }

        }

        if (nft['params'] && nft['params']['url'].includes('arc3')) {
            const response = await fetch(ipfs_proxy);
            if (response.headers.get('Content-Type' === 'application/json')) {
                const data = await response.json();
                let arc3ImageURL = data['image'];
                if (arc3ImageURL.startsWith('ipfs://')) arc3ImageURL = `${proxy_path}/${arc3ImageURL.split('ipfs://')[1]}`;
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
            const response = await fetch(arc19url);
            if (response.headers.get('Content-Type') === 'application/json') {
                let arc3Data = await response.json();
                let arc3ImageURL = arc3Data['image'];
                if (arc3ImageURL.startsWith('ipfs://')) ipfs_proxy = `${proxy_path}/${arc3ImageURL.split('ipfs://')[1]}`;

            } else {
                ipfs_proxy = arc19url;
            }

        }

        const response = await fetch(ipfs_proxy, {method: 'HEAD'});
        if (response.headers.get('Content-Type' === 'application/json')) {
            const dataResponse = await fetch(ipfs_proxy);
            const data = await dataResponse.json();
            let arc3ImageURL = data['image'];
            if (arc3ImageURL.startsWith('ipfs://')) arc3ImageURL = `${proxy_path}/${arc3ImageURL.split('ipfs://')[1]}`;
            ipfs_proxy = arc3ImageURL;
        }
        else {
            return ipfs_proxy;
        }


        return ipfs_proxy;
    }
}

export {
    parseNFTImage,
    parseNFTImage2
}