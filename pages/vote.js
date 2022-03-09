import { useState, useEffect } from "react";

import Head from "next/head";
import styles from "../styles/Home.module.css";
import layout from "../styles/Layout.module.css";
import buttons from "../styles/Buttons.module.css";
import fonts from "../styles/Fonts.module.css";

import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import ProgressBar from 'react-bootstrap/ProgressBar';
import abi from "../public/abi/voting.json";
import React from 'react';
import HoverVideoPlayer from 'react-hover-video-player';
import InputSpinner from 'react-bootstrap-input-spinner';
import Button from 'react-bootstrap/Button';
import ReactDOM from 'react-dom';
import Countdown from 'react-countdown';





import { ethers } from "ethers";

import useWindowSize from "../hooks/useWindowSize";

import toast, { Toaster } from "react-hot-toast";
export default function Home() {
  const injected = new InjectedConnector({ supportedChainIds: [1] });
  const { activate, account, active, deactivate, library, chainId } =
    useWeb3React();
  const size = useWindowSize();

  const max = 5;
  const min = 1;
  const [count, setCount] = useState(1);
  const [contract, setContract] = useState(null);
  const [amountSold_1, setAmountSold_1] = useState(0);
  const [percentageSold_1, setPercentageSold_1] = useState(0);
  const [amountSold_2, setAmountSold_2] = useState(0);
  const [percentageSold_2, setPercentageSold_2] = useState(0);
  const tot_supply = 120;
  const [left, setLeft] = useState(120);
  const [minted, setMinted] = useState(0);


  const [numcount, setnumCount] = useState(1);
  const [project, setproject] = useState("");

  const [num1, setnum1] = useState(1);
  const [num2, setnum2] = useState(1);

  const onnumChange = (value) => {
    console.log(value);
    setnumCount(value);
  }

  const buttonState = true;




  const onConnect = (choice) => {
    if (active) {
     // console.log('Im connected and Going to mint');
      //console.log('choice' + choice);

      if (choice == 1){
        vote(choice);
        }
      else if (choice == 2){
        vote(choice);
        }
    } 
    else {
     // console.log('Im not connected ');
     // console.log('choice' + choice);
      activate(injected);
      if (active){
        //console.log('Now Ill mint');
       // console.log('choice' + choice);
      //  console.log(count);
        if (choice == 1){
          vote(choice);
         }
        else if (choice == 2){
          vote(choice);
        }
      } 
      else {
       // console.log('Im not connected ');
      //  console.log('project' + project);
      //  console.log('choice' + choice);
        activate(injected);
      }
    }
  };

  const metamaskButtonContents = () => {

    if (active) {
      var connected = (account.substring(0, 6) + " Connected" );
      return (
          <div className={fonts.connect} > {connected}</div>
      );
    } else {
      return (
          <div className={fonts.connect}>{"Connect your wallet"}</div>
      );
    }
  };

  const onMint = (tempContract) => {
    return async (_to, _count) => {
      if (!tempContract) {
        return;
      }

      let tempAmountSold_1 = await tempContract.Animeta();
      let tempAmountSold_2 = await tempContract.Vogu();
      let tot_supply = await tempContract.MAX_SUPPLY();
      let minted = await tempContract.totalSupply();
      let left = minted-0
     // let tot_supply = 120;
     // let tempAmountSold_1 = 50;
     // let tempAmountSold_2 = 50;
      //let numberSold = tempAmountSold.toNumber();
      let numberSold_1 = tempAmountSold_1;
      let percentageSold_1 = ((numberSold_1/(tot_supply/2)) * 100).toFixed(2) ;
      let numberSold_2 = tempAmountSold_2;
      let percentageSold_2 = ((numberSold_2/(tot_supply/2))  * 100).toFixed(2) ;


      setAmountSold_1(numberSold_1);
      setPercentageSold_1(percentageSold_1);
      setAmountSold_2(numberSold_2);
      setPercentageSold_2(percentageSold_2);
      setLeft(left);
    };
  };

  const vote = async (choice) => {
    //console.log('mintingtime');
    console.log('choice is ' + choice);
    if (!library) {
      toast.error("Please connect your wallet first");
      return;
    }

    const signer = library.getSigner(account);


    if (!signer) {
      toast.error("Please connect your wallet first");
      return;
    }
    const signedContract = contract.connect(signer);


    if (chainId != [1]) {
      toast.error("Please connect to the Ethereum Mainnet");
      return;
    }

   let tempcount = num1;
  // console.log('tempcount is' + tempcount);
   console.log('choice is ' + choice);   
   if (choice == 2) {
      tempcount = num2;
      console.log('tempcount is' + tempcount);
      console.log('choice is ' + choice);
   }
   setCount(tempcount);
    if (count > max || count < min) {
      toast.error("Please mint between 1 and 5 tokens");
      return;
    }


    let provider = ethers.getDefaultProvider( );
      
    let balanceVar = await provider.getBalance(account).then((balance) => {
      let balanceInEth = ethers.utils.formatEther(balance);
      console.log(`balance: ${balanceInEth} ETH`);
      return balanceInEth;
    })
    if (balanceVar < (0.44*tempcount)){
      toast.error("Insufficient funds to mint!");
      return;
    }
    let ethValue = (0.44 * tempcount).toFixed(3);
    let value = ethers.utils.parseEther(ethValue.toString());



    let estimatedGas = await signedContract.estimateGas.vote(tempcount, choice, {
      value: value,
    });

    let gasLimit = estimatedGas
      .mul(ethers.BigNumber.from(10000 + 2000))
      .div(ethers.BigNumber.from(10000));

    let gasPrice = await library.getGasPrice().catch((error) => {
      console.log(error);
      toast.error("An error occurred. You may be out of ETH");
    });

    let tx = await signedContract
      .vote(tempcount, choice, {
        gasLimit: gasLimit,
        gasPrice: gasPrice,
        value: value,
      })
      .catch((error) => {
        console.log(error);
        toast.error("An error occurred. You may be out of ETH");
        let tempcount = num1;
        console.log('tempcount is' + tempcount);
        console.log('choice is ' + choice);   
        if (choice == 2) {
           tempcount = num2;
           console.log('tempcount is' + tempcount);
           console.log('choice is ' + choice);
        }
        setCount(tempcount);
      });

    if (!tx) {
      return;
    }

    return tx
      .wait()
      .then(() => {
        toast.success("You have successfully minted!");
      })
      .catch((error) => {
        console.log(error);
        toast.error("An error occurred while minting");
      });
  };


  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return (
        <p></p>
      );
    } else {
      // Render a countdown
      return (
        <span style={{lineHeight: "3rem" }}>
          Releasing Oct 28, 8:30PM UTC - Days: {String(days).padStart(2, "0")} Hours: {String(hours).padStart(2, "0")} Minutes: {String(minutes).padStart(2, "0")}
        </span>
      );
    }
  };


  useEffect(async () => {
    let provider = ethers.getDefaultProvider(
        "https://rinkeby.infura.io/v3/d8f4a37178054ff1ba338cb77b5e820e"
        //"http://127.0.0.1:7545"
    );

    let contractAddress = "0x02f74CBBAaF1E149b97DD5d606C888266159903A";
    let tempContract = new ethers.Contract(contractAddress, abi, provider);

    setContract(tempContract);

    tempContract.on("Vote", onMint(tempContract));


    let tempAmountSold_1 = await tempContract.Animeta();
    let tempAmountSold_2 = await tempContract.Vogu();
    let tot_supply = await tempContract.MAX_SUPPLY();
    let minted = await tempContract.totalSupply();
    let left = minted-0
    //let tot_supply = 120;
    //let tempAmountSold_1 = 50;
    //let tempAmountSold_2 = 50;
    //let numberSold = tempAmountSold.toNumber();
    let numberSold_1 = tempAmountSold_1;
    let percentageSold_1 = ((numberSold_1/(tot_supply/2))  * 100).toFixed(2) ;
    let numberSold_2 = tempAmountSold_2;
    let percentageSold_2 = ((numberSold_2/(tot_supply/2))  * 100).toFixed(2) ;
    setAmountSold_1(numberSold_1);
    setPercentageSold_1(percentageSold_1);
    setAmountSold_2(numberSold_2);
    setPercentageSold_2(percentageSold_2);
    setLeft(left);
    
    
  }, []);
 

  return ( 
  <div className={styles.container}>
    <Head>
      <title>Metaversus</title>
      <meta name="description" content="Metaversus" />
      <link rel="icon" href="/favicon.ico" />
      
      <link
        rel="stylesheet"
        type="text/css"
        href="https://fonts.googleapis.com/css?family=Montserrat"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name='This Site and Smart Contract Developed by Teej.ETH of CryptidLabs.XYZ'/>
    </Head>
    <Toaster />
{/*     <Navbar
      collapseOnSelect
      expand="lg"
      bg="light"
      variant="light"
      className={layout.navbar}
    >
      <Navbar.Toggle
        aria-controls="responsive-navbar-nav"
        style={{ margin: "1.25rem 0", border: "0" }}
      />
      <Navbar.Collapse
        id="responsive-navbar-nav"
        style={{ alignContent: "center" }}
      >
        <Nav className="me-auto">
          <Nav.Link href="#voting" className={fonts.navbarText} >
            Cast Your Vote
          </Nav.Link>
          <Nav.Link href="#faq" className={fonts.navbarText} >
            FAQs
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
      <Nav
        style={{ display: "flex", flexDirection: "row", minWidth: "128px" }}
      >
        <Nav.Link style={{ margin: "auto" }}>
          {metamaskButtonContents()}
        </Nav.Link>
        <Nav.Link
          eventKey={1}
          href="#twitter"
          target="_blank"
          href="https://twitter.com/rhett"
          className="filter-blue"
          style={{ margin: "auto" }}
        >
          <img
            src="/assets/twitter.svg"
            width="34px"
            height="27px"
            style={{
              cursor: "pointer",
            }}
          />
        </Nav.Link>
        <Nav.Link
          eventKey={2}
          href="#youtube"
          target="_blank"
          href="https://www.youtube.com/rhettdashwood"
          style={{ margin: "auto" }}
        >
          <img
            src="/assets/youtube.svg"
            width="34px"
            height="27px"
            style={{
              filter: "invert(16%) sepia(99%) saturate(4586%) hue-rotate(225deg) brightness(102%) contrast(98%)",
              cursor: "pointer",
            }}
          />
        </Nav.Link>
        <Nav.Link
          eventKey={3}
          href="#insta"
          target="_blank"
          href="https://www.instagram.com/mankind/"
          style={{ margin: "auto" }}
        >
          <img
            className="filter-blue"
            src="/assets/instagram.svg"
            width="34px"
            height="27px"
            style={{
              cursor: "pointer",
            }}
          />
        </Nav.Link>
        <Nav.Link
          eventKey={4}
          href="#memes"
          target="_blank"
          href="https://opensea.io/collection/Metaversus_AVV"
          style={{ margin: "auto" }}
        >
          <img
            src="/assets/opensea.png"
            width="27px"
            height="27px"
            style={{
              filter: "invert(16%) sepia(99%) saturate(4586%) hue-rotate(225deg) brightness(102%) contrast(98%)",
              cursor: "pointer",
            }}
          />
        </Nav.Link>
      </Nav>
    </Navbar> */}
    <div className="logo_row">
 
    <div className="countdown">
    <Countdown date={'28 Oct 2021 20:30:00 GMT'} renderer={renderer}/>
    </div>
      <img className="logo" width="40%" src="/assets/logo.png" />
    </div>
    <div className="intro">
    
      <div className="flex-row-custom">
          <div >You can't be part of every community.</div>
            
            <div className={fonts.bolditalic} ><em>You must choose! </em></div>
            
            <div>
            <span>A limited edition NFT artwork by Mankind will be created.</span><p> This cyber future city art will embody one community only.</p>
            </div>
            <div>You decided that the <a href="https://www.animetas.io/"><span className={fonts.links}>Animeta</span></a> won the battle, instead of <a href="http://thevogu.io/"><span className={fonts.links}>The Vogu Collective</span></a></div>
            
      </div>
    </div>
    <div id="vs-progress">
      <div className="flex-row-custom max-width-container">
        <div className="left">
          <div className="progress" style={{ height: "35px", width: "80%" }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{
                //width: `${percentageSold_1}%`,
                width: `66.667%`,
                background:
                  "transparent linear-gradient(90deg, #0000FF 0%, #BF40BF 100%) 0% 0% no-repeat padding-box",
                 }}
                 
              //aria-valuenow={percentageSold_1}
              aria-valuenow='66.667'
              aria-valuemin="0"
              aria-valuemax="100"
           //></div><div  className="progresstitle1" > Animeta:  <span className={fonts.progper}>{percentageSold_1} %</span></div>
           ></div><div  className="progresstitle1" > Animeta:  <span className={fonts.progper}>66.67 %</span></div>
          </div>
          </div>
          <div className="right">
          <div className="progress" style={{ height: "35px", width: "80%" }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{
                float: 'right',
                //width: `${percentageSold_2}%`,
                width: `33.33%`,
                background:
                  "transparent linear-gradient(90deg, #0000FF 0%, #BF40BF 100%) 0% 0% no-repeat padding-box",
                 }}
              aria-valuenow={percentageSold_2}
              aria-valuenow='33.33'
              aria-valuemin="0"
              aria-valuemax="100"
              
           //></div><div  className="progresstitle2" style={{float: 'right',transform: 'rotate(-180deg)',}}>The Vogu:  <span className={fonts.progper}>{percentageSold_2} %</span></div>
           ></div><div  className="progresstitle2" style={{float: 'right',transform: 'rotate(-180deg)',}}>The Vogu:  <span className={fonts.progper}>33.33 %</span></div>
          </div>
          </div>
          <div className="bottom"> Minted: {left} - Minting Closed!  <span className={fonts.linkspink}>Animeta Won!</span><br/>  <a href="https://opensea.io/collection/metavs"><span className={fonts.links}>View on Opensea</span></a></div>
      </div>

    </div>
    <div id="voting">
      <div className="flex-row-custom max-width-container">
      <div className="OL">
            <img
                src="/assets/bordertop-left.png"
                width="100%"
             />
        <div className="left">
          <div className="vid">
        <HoverVideoPlayer
      videoSrc="/assets/Metaversus-Animeta_web.mp4"
      muted={false}
      volume={0.5}
      loop={true}
      controls
      // Disable both the download and fullscreen buttons
      controlsList="nodownload"
      pausedOverlay={
        <img
          src="/assets/metaversus-animeta-preview.jpg"
          alt=""
          style={{
            // Make the image expand to cover the video's dimensions
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      }
      />
          </div>
          </div>
          <div className="connect">
          <div className="spinwrap">
          <div className="spinner">
          <InputSpinner
                    type={'int'}
                    precision={2}
                    max={max}
                    min={0}
                    step={1}
                    onChange={num1=>setnum1(num1)}
                    variant={'dark'}
                    size="sm"
                    arrows={true}
                    value= {1}
                    />
            </div>  
            
            <div className="under"> Quantity</div>
            </div>
            <div className="mintwrap">
              <Button variant="primary" size="lg" disabled={buttonState} 
                    onClick={() => onConnect(1)}
                    >
              <div> Mint and vote: 
              Metaversus-Animeta</div>
              <div>{metamaskButtonContents()}</div>
              </Button>
              <span className={fonts.lighter}>0.44 ETH Each + Gas</span>
          </div>
          </div>

        <div className="vote"></div>
        <img
               src="/assets/bordertop-left.png"
               width="100%"
               style={{transform: 'rotate(-180deg)',}}
             />
        </div>
        <div className="center">
          <img src="/assets/vs.png" width="50%" />
        </div>
          <div className="OR">
            <img
                src="/assets/bordertop-right.png"
                width="100%"
             />
            <div className="right">
            <div className="vid">
        <HoverVideoPlayer
      videoSrc="/assets/Metaversus-Vogu_web.mp4"
      muted={false}
      volume={0.5}
      loop={true}
      controls
      // Disable both the download and fullscreen buttons
      controlsList="nodownload"
      pausedOverlay={
        <img
          src="/assets/metaversus-vogu-preview.jpg"
          alt=""
          style={{
            // Make the image expand to cover the video's dimensions
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      }
      />
          </div>
        </div>
        <div className="connect">
          <div className="spinwrap">
          <div className="spinner">
          <InputSpinner
                    type={'int'}
                    precision={2}
                    max={max}
                    min={0}
                    step={1}
                    onChange={num2=>setnum2(num2)}
                    variant={'dark'}
                    size="sm"
                    arrows={true}
                    value= {1}
                    />
            </div>  

            <div className="under"> Quantity</div>
            </div>
            <div className="mintwrap">
            <Button variant="primary" size="lg" disabled={buttonState} 
                    onClick = {() => onConnect(2)}
                    >
              <div>Mint and vote:
              Metaversus-Vogu</div>
              <div>{metamaskButtonContents()}</div>
              </Button>
              <span className={fonts.lighter}>0.44 ETH Each + Gas</span>
            </div>
          </div>

            <div className="vote"></div>
            <img
               src="/assets/bordertop-right.png"
               width="100%"
               style={{transform: 'rotate(-180deg)',}}
             />
          </div>
      </div>
    </div>
    <div id="faq">
      <div className="flex-row-custom max-width-container">
      <h3>FAQs</h3>

      <h4>HOW DOES THIS WORK?</h4>
      <h5>This NFT artwork pits two communities against each other. A limited edition NFT will be created of one artwork only. 
        A purchase is a vote for which artwork you want minted (you must choose a side). Once sold out, the artwork with the majority 
        of votes wins and becomes the final NFT, the losing side is not.</h5>
      <h5>(So if you purchase the NFT and vote for Vogu, if Animeta wins you get the Animeta NFT artwork and accept you lost the vote.)</h5>

      <h4>WHAT DO I NEED?</h4>
      <h5>You’ll need Metamask and Ether to mint. The cost is 0.44 ETH + gas per NFT.<br/>(Secondary sales will include 5% royalties)</h5>
      

      <h4>PROJECT GOALS?</h4>
      <h5>Metaversus hopes to support and raise the profile of both communities in a healthy competition for mutual benefit in the collectible space.</h5>
      <h5>The profile of each community will be shared across social media. 20% of sales will be used to sweep the floor of the winning project and I will make a video of the winning results on YouTube.</h5>
      
      <h4>SPECS</h4>
      <h5>ERC-721 Numbered editions Dimensions: 1920x1080 MP4</h5>
      <h5>Full size link: <a href="https://ipfs.infura.io/ipfs/QmTJzvkDUrYpXK6e5rH7Bqg3wg1X1Qkhp6Y87bJKe17xme"><span className={fonts.links}>Metaversus - Animeta</span></a>  vs   <a href="https://ipfs.infura.io/ipfs/QmQXk2i2Mk4f7nKzG5AHvdAA8mcZk7F5jJZ8vsrUp9N5d7"><span className={fonts.links}>Metaversus - Vogu</span></a>  
      </h5>
      <h5>Verified Contract: <a href="https://etherscan.io/address/0x02f74CBBAaF1E149b97DD5d606C888266159903A#code"><span className={fonts.links}>View On Etherscan</span></a> </h5>
      </div>
    </div>

    <div id="footer">
      <div className="flex-row-custom max-width-container">

          <a
            className="filter-white"
            target="_blank"
            href="https://twitter.com/rhett"
          >
            <img
              src="/assets/twitter.svg"
              width="34px"
              height="27px"
              style={{
                filter: "brightness(0) saturate(100%)",
                cursor: "pointer",
                opacity: "1",
              }}
            />
          </a>
          <a
            className="filter-white"
            target="_blank"
            href="https://www.youtube.com/rhettdashwood"
          >
            <img
              src="/assets/youtube.svg"
              width="34px"
              height="27px"
              style={{
                filter: "brightness(0) saturate(100%)",
                cursor: "pointer",
                opacity: "1",
              }}
            />
          </a>
          <a
            className="filter-white"
            target="_blank"
            href="https://www.instagram.com/mankind/"

          >
            <img
              src="/assets/instagram.svg"
              width="34px"
              height="27px"
              style={{
                filter: "brightness(0) saturate(100%)",
                cursor: "pointer",
                opacity: "1",
              }}
            />
          </a>
          <a
            className="filter-white"
            target="_blank"
            href="https://opensea.io/collection/metavs"
          >
            <img
              src="/assets/opensea.png"
              width="27px"
              height="27px"
              style={{
                filter: "brightness(0) saturate(100%)",
                cursor: "pointer",
                opacity: "1",
              }}
            />
          </a>
      </div>
    
    </div>
    </div>

  );
}
