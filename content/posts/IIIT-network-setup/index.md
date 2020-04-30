---
title: "The best possible IIIT Internet setup"
description: Setting up smart VPN and hotspot, aimed towards IIIT students
date: "2020-04-30"
draft: true
slug: "/blog/IIIT-network-setup"
tags:
  - IIIT
  - Network
  - Guides
---

Hello!

In this post, I am going to explain how to setup a seemless internet experience if you are using IIIT network.

We are going to cover the following things:

- Why should you use a VPN ?
- What are routes and how do they work ?
- What are virtual network adapters ?
- How to setup a hotspot using IIIT LAN
- How to automate and forget

## Why should you use a VPN

Using a VPN service allows you to hide your information from anyone trying to snoop on you.
It also allows you to access websites and services blocked on your network. You can also use VPNs to escape Geofencing.

- Since Port 22 is blocked, you wont be able to SSH to any device outside the IIIT Network.
- Since UDP is blocked you wont be able to play PUBG on your phone (or any other game)
- Since we live in India, you can only access content on Netflix India

But an added bonus for IIIT network is that it is also protects you from frequent internet outages when the proxy server is overloaded.

<div style="position:relative;height:0;overflow:hidden;max-width:100%;padding-bottom:56.25%;background-color:white;">
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Proxy_concept_en.svg/1280px-Proxy_concept_en.svg.png" alt="proxy-img" style="position:absolute;top:0;left:0;width:100%;height:100%;">
</div>
<center><span>Working of a Proxy Server</span></center>

When the proxy server is overloaded each time Alice wants to talk to Bob it has to wait for proxy to process its request. So each new request has to fight for resources, and cause more congestion at the proxy. This is often the case with the proxy server at IIIT, even after the Student SysAdmins have tried their best to make sure it works seamlessly.

But what if we could make a connection with ONE request and use the same connection as a tunnel for all other requests? This is where a VPN comes in.

<div style="position:relative;height:0;overflow:hidden;max-width:100%;padding-bottom:30.33%;background-color:white;">
<img src="/vpn-1.jpg" alt="vpn-img" style="position:absolute;top:0;left:0;width:100%;height:100%;">
</div>
<center><span>Working of a VPN</span></center>

(PS: I use NordVPN, but virtually any VPN service works in the same way)

When a VPN connection is started, a tunnel is setup between your machine and the VPN server.
All data flowing through this tunnel is encrypted.

Since the VPN server has internet access with no restrictions on websites or services.
It can forward your requests to the internet and return the response.

Any website you visit while connected to the VPN will see your IP as the VPN server IP and location as the server's location.

This is all good and simple to setup. You just need the OpenVPN config file for the VPN server you want to connect to.
Make sure to use a config which uses TCP Port 443 ( or any other unblocked port )

Using Port 443 is your best bet as it is used to setup HTTPS for connection and thus will never be blocked.

So now the VPN is setup and working. All the websites you visit are actually routed through the VPN server giving you limitless freedom.

But if you try to access any website on the IIIT intranet (like: [Proxy Status](https://proxy.iiit.ac.in), [IIIT GitLab](https://gitlab.iiit.ac.in) or [Intranet Index](https://intranet.iiit.ac.in) ) it wont work.

This is because these are hosted inside the IIIT network and are not available on the internet.

In the next section I will explain what network routes are and how with some simple config changes we can leverage them to get a seamless VPN experience.

## What are network routes and how do they work
