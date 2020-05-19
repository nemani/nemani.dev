---
title: "The best possible IIIT Internet setup"
description: Setting up smart VPN and hotspot, aimed towards IIIT students
date: "2020-05-19"
draft: false
slug: "/blog/IIIT-network-setup"
tags:
  - IIIT
  - Network
  - Guides
---

Hello!

In this post, I am going to explain how to set up a seamless internet experience if you are using IIIT network.

We are going to cover the following things:

- [Advantages of using a VPN](#Advantages of using a VPN)
- [Network interfaces and kernel magic](#Network interfaces and kernel magic)
- [Routing Table](#Routing Table)
- [Creating a WiFi Hotspot with create_ap](#Creating a WiFi Hotspot with create_ap)
- [Steps for Automating](#Steps for Automating)
- [Conclusion](#Conclusion)

PS: This post has more theory then needed and has some very simple tutorial steps,
you can [skip to the steps to follow at the bottom.](#Steps for Automating)

<h2 id="Advantages of using a VPN"> Advantages of using a VPN </h2>

Using a VPN service allows you to hide your information from anyone trying to snoop on you.
It also allows you to access websites and services blocked on your network. You can also use VPNs to escape Geofencing.

- Since Port 22 is blocked, you won't be able to SSH to any device outside the IIIT Network
- Since UDP is blocked you won't be able to play PUBG on your phone (or any other game)
- Since we live in India, you can only access content on Netflix India

But a bonus for IIIT network is that it also protects you from frequent internet outages when the proxy server is overloaded.

<div style="position:relative;height:0;overflow:hidden;max-width:100%;padding-bottom:56.25%;background-color:white;">
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Proxy_concept_en.svg/1280px-Proxy_concept_en.svg.png" alt="proxy-img" style="position:absolute;top:0;left:0;width:100%;height:100%;">
</div>
<center><span>Working of a Proxy Server</span></center>

When the proxy server is overloaded each time Alice wants to talk to Bob it has to wait for proxy to process its
request. So each new request has to fight for resources and cause more congestion at the proxy.
This is often the case with the proxy server at IIIT, even after the Student SysAdmins have tried their best to make sure it works seamlessly.

But what if we could make a connection with ONE request and use the same connection as a tunnel for all other requests?
This is where a VPN comes in.

<div style="position:relative;height:0;overflow:hidden;max-width:100%;padding-bottom:30.33%;background-color:white;">
<img src="/vpn-1.jpg" alt="vpn-img" style="position:absolute;top:0;left:0;width:100%;height:100%;">
</div>
<center><span>Working of a VPN</span></center>

(PS: I use NordVPN, but virtually any VPN service works in the same way)

When a VPN connection is started, a tunnel is set up between your machine and the VPN server.
All data flowing through this tunnel is encrypted.

Since the VPN server has internet access with no restrictions on websites or services.
It can forward your requests to the internet and return the response.

Any website you visit while connected to the VPN will see your IP as the VPN server IP and location as the server's location.

This is all good and simple to set up. You just need the OpenVPN config file for the VPN server you want to connect to.
Make sure to use a config which uses TCP port 443 ( or any other unblocked port )

Using port 443 is your best bet as it is used to set up HTTPS for connection and thus will never be blocked.

So now the VPN is set up and working.
All the websites you visit are routed through the VPN server giving you limitless freedom.

But if you try to access any website on the IIIT intranet (like: [Proxy Status](https://proxy.iiit.ac.in), [IIIT GitLab](https://gitlab.iiit.ac.in) or [Intranet Index](https://intranet.iiit.ac.in) ) it won't work.

This is because these are hosted inside the IIIT network and are not available on the internet.

<h2 id="Network interfaces and kernel magic"> Network interfaces and kernel magic </h2>

Each laptop has one (or more) hardware network cards. These cards allow the machine to connect to networks. Usually, a laptop will contain an ethernet card and a wireless network card. So you can connect to both at once.
These cards only allow you to join one hardware network at a time, which is why you can connect to a wifi or use your device as a wifi hotspot but not do both at the same time.

These cards are your _physical_ network interfaces, but the kernel represents these as _software_ network interfaces.

To see all the network interfaces active right now on your machine you can run the following command

```bash
$ ip link show
```

This command will list all the network interfaces or `links` according to your kernel.

For a ubuntu laptop, there will usually be 3 interfaces.

1. Loopback (`lo`)
2. Ethernet (`enp2s0` or similar)
3. Wireless (`wlp3s0` or similar)

There may be more based on other services running on the machine and the hardware attached, for example, docker will setup the docker0 network interface. If you are interested in learning more about how docker networking works let me know in the comments!

This is possible because it is not necessary for each software network interface to be attached to a network card. This allows us to set up virtual network interfaces. This is in fact how OpenVPN works. It makes a [TUN/TAP ](https://en.wikipedia.org/wiki/TUN/TAP) and connects this to a _Virtual_ _Private_ _Network_.

In this almost magical setup, the kernel treats this virtual TUN/TAP device as it would any other network device. It can send data through this interface even though the underlying piping goes through your hardware network via ethernet.

<div style="position:relative;height:0;overflow:hidden;max-width:100%;padding-bottom:56.25%;background-color:white;">
<img src="/openvpn-scheme.svg" alt="openvpn-scheme" style="position:absolute;top:0;left:0;width:100%;height:100%;">
</div>
<center><span>OpenVPN TUN/TAP Piping</span></center>

Each interface may have one or more IP addresses associated with it that are valid in their corresponding network.

If your machine (Machine A) is connected to IIIT network via ethernet and connected to a VPN, your eth/enp2s0 interface will have an IP address that is valid inside the IIIT network and your TUN/TAP interface will have an IP address valid inside your VPN.

If another machine (Machine B) is connected to the same VPN, A & B can talk to each other using the respective VPN IP address.

Fun Fact: The DHCP server of IIIT assigns IP addresses to you based on where you are on campus. If you are connected via the IIIT VPN you will get an IP that looks like `10.11.0.X`.

<h2 id="Routing Table"> Routing Table </h2>
So we now know what network interfaces are, but how does the kernel determine what packets to send on which interface?

Each device in a network has its own routing table which allows it to determine _where_ to send the packet.

To see the routing table for your machine run the following command.

```bash
ip route show
```

```text:title=Example%20Output
default via 192.168.1.1 dev wlp3s0 proto dhcp metric 600
169.254.0.0/16 dev wlp3s0 proto kernel scope link metric 1000
192.168.1.0/24 dev wlp3s0 proto kernel scope link src 192.168.1.22 metric 600
```

Going over all the details of this routing table would be tedious, so we will focus on what matters here.
The format of each line is roughly

```
<target IP range> dev <device or interface name> ..{other params}
```

Whenever a packet is leaving from your machine, the routing table checks the destination of the packet and selects the route which matches the target IP range. Playing with the routing table allows us to select where to send packets depending on the destination!

If no rule matches the destination the packet is sent through the default route which is the first line in the above example output.

This means that we can set it up in such a way that if the packet is headed to the internet we send it through the TUN/TAP interface i.e. through the VPN, but if the packet destination is within the IIIT network we can send it directly to the ethernet interface.

The `ip` command is very powerful and allows us to do a lot of things with the routing table. Look at the [ip command man page](http://man7.org/Linux/man-pages/man8/ip.8.html) for more intriguing usecases.

We can add new routes using the `ip route add {params}` using a terminal or using the network settings. To keep things simple and to make sure that settings are persisted, I will make these changes in the network settings. This is detailed later in the post.

If you are connected to a VPN your default route is set to TUN/TAP interface created by OpenVPN. To route all IIIT traffic to enp2s0 you can run the following command.

```bash
sudo ip route add 10.0.0.0/8 via 10.1.34.1 dev enp2s0
```

`10.0.0.0/8` which is equivalent to `10.x.x.x` which is the IP format for all devices on the IIIT network.
`10.1.34.1` is the default gateway address for my wing in OBH.
and `enp2s0` specifies the network interface to send the packet on.

<h2 id="Creating a WiFi Hotspot with create_ap"> Creating a WiFi Hotspot with create_ap </h2>
When I am in the IIIT network connected via ethernet I like to use a hotspot created from my laptop to connect my phone to the internet. I do this mainly because the Airtel/Jio reception in my hostel room is absolutely horrendous.

For doing this my recommended tool is [create_ap](https://github.com/oblique/create_ap)

create_ap allows you to create an Access Point or Hotspot which other devices can connect to.
Installing the service is pretty straight forward and once you set up a persistent systemd service, you can set it up to start on boot. This means that whenever you start your laptop it will automatically set up an AP for your phone to connect to.

If you face any issues with setting this up, let me know in the comments and I can write a more detailed post for the same. But here is the create_ap.conf which I use.

```text:title=create_ap.conf
CHANNEL=default
GATEWAY=110.0.0.1
WPA_VERSION=2
ETC_HOSTS=0
DHCP_DNS=110.0.0.1,10.4.20.222,10.4.20.204,8.8.8.8
NO_DNS=0
NO_DNSMASQ=0
HIDDEN=0
MAC_FILTER=0
MAC_FILTER_ACCEPT=/etc/hostapd/hostapd.accept
ISOLATE_CLIENTS=0
SHARE_METHOD=nat
IEEE80211N=0
IEEE80211AC=0
HT_CAPAB=[HT40+]
VHT_CAPAB=
DRIVER=nl80211
NO_VIRT=1
COUNTRY=
FREQ_BAND=2.4
NEW_MACADDR=
DAEMONIZE=0
NO_HAVEGED=0
WIFI_IFACE=wlp3s0
INTERNET_IFACE=enp2s0
SSID=ViolentDelights
PASSPHRASE=Vi0lent3nds
USE_PSK=0
```

Here are the interesting parts:

1. `DHCP_DNS` specifies the DNS servers that all connected devices use for resolution. Here I have added `110.0.0.1` which is the dns server started by `create_ap`, `10.4.20.222` & `10.4.20.204` are the IIIT ns3 & ns4 servers respectively and `8.8.8.8` is a dns service by google for addresses on the internet.

2. `NO_VIRT` tells `create_ap` to not create a virtual network interface and to use the `WIFI_IFACE` for networking.

3. `WIFI_IFACE` specifies the interface to create the AP on & `INTERNET_IFACE` specifies the interface to forward the packets to. Here they are set to my WiFi IFACE and Ethernet IFACE respectively.

4. If we set the `INTERNET_IFACE` to tun0 (created by OpenVPN) all packets received from the devices connected to the AP will be forwarded to the VPN! This is extremely useful as it allows the devices connected to the AP to _bypass the entire IIIT network_ this means that any device which does not support proxy (PUBG on your phone, or the Xbox in your room) can connect to the internet with no issues whatsoever!

<h2 id="Steps for Automating"> Steps for Automating </h2>

If you came to this blog post in hopes of quickly improving your network, the steps are below, but I really recommend that you go through the explanation above, this setup is not 100% stable and the above details will allow you to debug it if you ever need to. Also, it will broaden your understanding of networking in general.

### 1. Connect to IIIT network via LAN

- Name this connection `Hostel Auth`
- Ensure you have added your 802.1x creds
- Make sure you set the proxy to `None`
- Go to IPv6 and set the method to Ignore (turning IPv6 off is not always recommended but I have not faced any issues yet and it seems to make the IIIT network a little bit faster)
- Wait for the connection to complete and confirm you can access both proxy.iiit.ac.in and facebook.com

### 2. Find the IP of your Default Gateway

- run `ip route show`
- The first line in the output is the default route
- `default via 10.1.34.1 dev enp2s0 ...`
- Write down the Default Gateway IP (For me it is: `10.1.34.1`)

### 3. Setup your VPN

- Best way to set up an OpenVPN-based VPN on ubuntu is to install `network-manager-openvpn-gnome` using APT
- Go to network settings
- Create a new VPN
- Select import from OpenVPN config
- Select the correct .ovpn config file
- Save this as 'MyVPN' connection.
- Go to Proxy tab and enter IIIT Proxy details
- Go to IPv4 and set additional DNS servers to `10.4.20.204, 10.4.20.222, 8.8.8.8`
- Go to IPv6 and set the method to Ignore (turning IPv6 off is not always recommended but I have not faced any issues yet and it seems to make the IIIT network a little bit faster)

### 4. Modify Hostel Auth network settings

<div style="position:relative;height:0;overflow:hidden;max-width:100%;padding-bottom:66.66%;background-color:white;">
<img src="/hostelauth.jpeg" alt="hostel-auth-network-settings" style="position:absolute;top:0;left:0;width:100%;height:100%;">
</div>
<center><span>Hostel Auth Settings will look similar to this</span></center>

- The interface should look like the above
- Go to General tab and check 'Automatically connect to VPN when using this connection'
- select MyVPN from the dropdown
- Go to IPv4 Settings tab
- Set additional DNS servers to `10.4.20.204, 10.4.20.222, 8.8.8.8`
- click on routes to open a new window
- Add a new route with Address='10.0.0.0' Netmask='8' Gateway='`IP from step 2`' metric='100'
- Save the settings

### 5. Setup hotspot using `create_ap` service

- Install [create_ap](https://github.com/oblique/create_ap)
- Add a file with the following contents to /usr/lib/systemd/system
- Add create_ap.conf to /etc/
- Run `sudo systemctl daemon-reload` which will refresh the listing
- Run `sudo systemctl list-unit-files` and confirm that `create_ap.service` is present in the list
- Run `sudo systemctl enable create_ap.service` which will mark it to start on systemboot

```text:title=/usr/lib/systemd/system/create_ap.service
[Unit]
Description=Create AP Service
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/create_ap --config /etc/create_ap.conf
KillSignal=SIGINT
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### 6. PROFIT!

Now whenever your machine starts it will

- Connect to IIIT Network
- Connect to VPN
- Start a hotspot for your phone
- Configure route so that IIIT network resources are accessible

### BONUS: When to set proxy

I use the above setup extensively, it allows me to access the internet via a VPN so I can access any service which might be blocked on IIIT network.

It allows makes sure that all kinds of video calling applications work on my phone when it is connected to the hotspot and also that I don't have to change any settings when I try to open moodle or access the ada server.

But some services don't like it when you connect to a VPN, for example, I had trouble getting Hotstar to work as it considered me to be in the Netherlands where its service is not available.

To bypass this, I started using Hotstar in Firefox and set the proxy to proxy.iiit.ac.in inside the firefox settings. This ensures that all the traffic from firefox goes through the IIIT network and thus appears to Hotstar as a connection from within the country.

<h2 id="Conclusion"> Conclusion </h2>

It is effective to play around with the various network settings available to you if you use Linux.
It shows how powerful, flexible, and most importantly fun a Linux machine can be.

This is the first blog post I have written and it took a loooooong time for me to complete it, I am still learning and you - the reader - can be immensely helpful by sharing this with the rest of the IIIT janta.

Drop any and all feedback in the comments below and let me know what I should write about next.
If you try the above setup and it does not work for you, or if you have any ideas how I can improve it, leave a comment or send me an email at [blog-feedback@nemani.dev](mailto:blog-feedback@nemani.dev).
