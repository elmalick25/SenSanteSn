package org.sensante.sn.dto;

public class StockIntrantClotureDTO {

    private String produitNom;
    private String categorie;
    private int quantiteDelivree;
    private String uniteDelivree;
    private String detailsPoids;
    private int sortiesCabinet;
    private int restantPharmacie;
    private int pourcentageDisponible;
    private String statutDotation;

    public StockIntrantClotureDTO() {}

    public StockIntrantClotureDTO(String produitNom, String categorie, int quantiteDelivree,
                                  String uniteDelivree, String detailsPoids, int sortiesCabinet,
                                  int restantPharmacie, int pourcentageDisponible, String statutDotation) {
        this.produitNom = produitNom;
        this.categorie = categorie;
        this.quantiteDelivree = quantiteDelivree;
        this.uniteDelivree = uniteDelivree;
        this.detailsPoids = detailsPoids;
        this.sortiesCabinet = sortiesCabinet;
        this.restantPharmacie = restantPharmacie;
        this.pourcentageDisponible = pourcentageDisponible;
        this.statutDotation = statutDotation;
    }

    public String getProduitNom() { return produitNom; }
    public void setProduitNom(String produitNom) { this.produitNom = produitNom; }

    public String getCategorie() { return categorie; }
    public void setCategorie(String categorie) { this.categorie = categorie; }

    public int getQuantiteDelivree() { return quantiteDelivree; }
    public void setQuantiteDelivree(int quantiteDelivree) { this.quantiteDelivree = quantiteDelivree; }

    public String getUniteDelivree() { return uniteDelivree; }
    public void setUniteDelivree(String uniteDelivree) { this.uniteDelivree = uniteDelivree; }

    public String getDetailsPoids() { return detailsPoids; }
    public void setDetailsPoids(String detailsPoids) { this.detailsPoids = detailsPoids; }

    public int getSortiesCabinet() { return sortiesCabinet; }
    public void setSortiesCabinet(int sortiesCabinet) { this.sortiesCabinet = sortiesCabinet; }

    public int getRestantPharmacie() { return restantPharmacie; }
    public void setRestantPharmacie(int restantPharmacie) { this.restantPharmacie = restantPharmacie; }

    public int getPourcentageDisponible() { return pourcentageDisponible; }
    public void setPourcentageDisponible(int pourcentageDisponible) { this.pourcentageDisponible = pourcentageDisponible; }

    public String getStatutDotation() { return statutDotation; }
    public void setStatutDotation(String statutDotation) { this.statutDotation = statutDotation; }
}
